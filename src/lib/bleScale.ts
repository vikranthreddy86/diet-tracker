/**
 * Web Bluetooth client for the Dr. Trust SSW532 / ICOMON FG2211WB scale.
 * Protocol ported from openScale's DrTrustSSW532Handler.kt (GPLv3,
 * github.com/oliexdev/openScale). Weight-only: body-composition (BIA)
 * frames are read but not decoded, since that math isn't ported here.
 */

const SERVICE_UUID = 0xffb0;
const CHAR_CMD = 0xffb1;
const CHAR_WEIGHT = 0xffb2;
const CHAR_BC = 0xffb3;

export type ScaleStatus =
  | { phase: "requesting" }
  | { phase: "connecting" }
  | { phase: "waiting" }
  | { phase: "step-on" }
  | { phase: "measuring"; weightKg: number }
  | { phase: "done"; weightKg: number }
  | { phase: "error"; message: string };

export function isWebBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

function checksum(buf: number[]): number {
  let s = 0;
  for (let i = 3; i <= 18; i++) s += buf[i] & 0xff;
  return s % 32;
}

function readBE24(d: DataView, off: number): number {
  return (d.getUint8(off) << 16) | (d.getUint8(off + 1) << 8) | d.getUint8(off + 2);
}

async function writeCmd(char: BluetoothRemoteGATTCharacteristic, payload: number[]) {
  payload[19] = checksum(payload);
  const bytes = Uint8Array.from(payload);
  if (char.writeValueWithResponse) {
    await char.writeValueWithResponse(bytes);
  } else {
    await char.writeValue(bytes);
  }
}

export async function connectScale(
  bodyProfile: { heightCm: number; ageYears: number },
  onStatus: (s: ScaleStatus) => void,
): Promise<number> {
  if (!isWebBluetoothSupported()) {
    throw new Error("Web Bluetooth isn't supported in this browser. Use Chrome on Android.");
  }

  onStatus({ phase: "requesting" });
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SERVICE_UUID] }],
  });

  onStatus({ phase: "connecting" });
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(SERVICE_UUID);
  const cmdChar = await service.getCharacteristic(CHAR_CMD);
  const weightChar = await service.getCharacteristic(CHAR_WEIGHT);
  const bcChar = await service.getCharacteristic(CHAR_BC);

  let sessionId = 0;
  let pendingWeightKg = 0;
  let isLiveWeightLocked = false;
  let isLiveMeasurement = false;
  let pkt0Valid = false;

  return new Promise<number>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      try {
        server.disconnect();
      } catch {
        // already disconnected
      }
    };

    const finish = (weightKg: number) => {
      if (settled) return;
      settled = true;
      onStatus({ phase: "done", weightKg });
      writeCmd(cmdChar, [0x04, 0x03, 0x00, 0xb0, sessionId & 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        .catch(() => {})
        .finally(cleanup);
      resolve(weightKg);
    };

    const fail = (message: string) => {
      if (settled) return;
      settled = true;
      onStatus({ phase: "error", message });
      cleanup();
      reject(new Error(message));
    };

    const sendUserProfile = async () => {
      const ts = Math.floor(Date.now() / 1000);
      const h = Math.min(220, Math.max(100, Math.round(bodyProfile.heightCm)));
      const age = Math.min(127, Math.max(0, Math.round(bodyProfile.ageYears)));

      await writeCmd(cmdChar, [
        0x00, 0x03, 0x00, 0xb0, sessionId & 0xff,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      await writeCmd(cmdChar, [
        0x01, 0x1a, 0x00, 0xb8,
        (ts >>> 24) & 0xff, (ts >>> 16) & 0xff, (ts >>> 8) & 0xff, ts & 0xff,
        0x01, 0x4a, 0x01, h & 0xff, 0x17, 0x70, (0x80 | age) & 0xff, 0x13, 0x88, 0x0f, 0x00, 0,
      ]);
      const icomon = [0x69, 0x63, 0x6f, 0x6d, 0x6f, 0x6e]; // "icomon"
      await writeCmd(cmdChar, [0x01, 0x1a, 0x01, 0x00, 0x00, 0x00, 0x06, ...icomon, 0, 0, 0, 0, 0, 0, 0]);
    };

    const onWeightChanged = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const d = target.value;
      if (!d || d.byteLength < 9) return;
      if (d.getUint8(1) !== 0x07 || d.getUint8(3) !== 0xa2) return;
      const stability = d.getUint8(4);
      const kg = readBE24(d, 6) / 1000;
      if (kg <= 0) return;
      if (stability === 0x03) {
        pendingWeightKg = kg;
        isLiveWeightLocked = true;
      }
      onStatus({ phase: "measuring", weightKg: kg });
    };

    const onBcChanged = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const d = target.value;
      if (!d || d.byteLength < 20) return;
      const b1 = d.getUint8(1);
      const b2 = d.getUint8(2);

      if (b1 === 0x18) {
        if (b2 === 0x00) {
          sessionId = d.getUint8(0);
          onStatus({ phase: "waiting" });
          weightChar.addEventListener("characteristicvaluechanged", onWeightChanged);
          weightChar.startNotifications().catch((e) => fail(`Couldn't subscribe to weight updates: ${e}`));
        } else if (b2 === 0x01) {
          onStatus({ phase: "step-on" });
          sendUserProfile().catch((e) => fail(`Couldn't start measurement: ${e}`));
        }
        return;
      }

      if (b1 === 0x23) {
        if (b2 === 0x00) {
          const cmd = d.getUint8(3);
          isLiveMeasurement = cmd === 0xa3 || cmd === 0xa7;
          if (!isLiveMeasurement) {
            pkt0Valid = false;
            return;
          }
          pkt0Valid = d.getUint8(14) === 0x01;
          if (!pkt0Valid) return;
          const kg = readBE24(d, 9) / 1000;
          if (kg > 0) pendingWeightKg = kg;
        } else if (b2 === 0x02) {
          if (isLiveWeightLocked && isLiveMeasurement && pendingWeightKg > 0) {
            finish(pendingWeightKg);
          }
        }
      }
    };

    device.addEventListener("gattserverdisconnected", () => {
      if (settled) return;
      if (isLiveWeightLocked && pendingWeightKg > 0) {
        settled = true;
        onStatus({ phase: "done", weightKg: pendingWeightKg });
        resolve(pendingWeightKg);
      } else {
        fail("Scale disconnected before a stable weight was captured.");
      }
    });

    bcChar.addEventListener("characteristicvaluechanged", onBcChanged);
    bcChar.startNotifications().catch((e) => fail(`Couldn't connect to scale: ${e}`));
  });
}
