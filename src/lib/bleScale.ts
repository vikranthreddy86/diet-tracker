/**
 * Web Bluetooth client for Dr. Trust / ICOMON BLE scales.
 * Both protocols below live on the same service (0xFFB0) with the same
 * write characteristic (0xFFB1), but differ in whether a third,
 * indicate-only characteristic (0xFFB3) exists — that presence is what
 * we use to pick a protocol at connect time. Ported from openScale's
 * DrTrustSSW532Handler.kt and MGBHandler.kt (GPLv3,
 * github.com/oliexdev/openScale). Weight-only: body-composition (BIA)
 * frames are read but not decoded, since that math isn't ported here.
 */

const SERVICE_UUID = 0xffb0;
const CHAR_1 = 0xffb1; // write / config — both protocols
const CHAR_2 = 0xffb2; // notify — both protocols
const CHAR_3 = 0xffb3; // indicate — SSW532 protocol only

const CONNECT_TIMEOUT_MS = 15000;
const HANDSHAKE_TIMEOUT_MS = 20000;

export type BodyProfile = { heightCm: number; ageYears: number; sex: "male" | "female" };

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

function readBE24(d: DataView, off: number): number {
  return (d.getUint8(off) << 16) | (d.getUint8(off + 1) << 8) | d.getUint8(off + 2);
}

async function writeValue(char: BluetoothRemoteGATTCharacteristic, bytes: Uint8Array) {
  const buf = bytes as unknown as BufferSource;
  if (char.writeValueWithResponse) {
    await char.writeValueWithResponse(buf);
  } else {
    await char.writeValue(buf);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

function describeError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

/** Shared connect/disconnect/timeout scaffolding for both protocol implementations. */
function createSession(device: BluetoothDevice, server: BluetoothRemoteGATTServer, onStatus: (s: ScaleStatus) => void) {
  let settled = false;
  let weightKg = 0;
  let weightLocked = false;
  let teardown: (() => Promise<void>) | null = null;
  let resolveFn!: (v: number) => void;
  let rejectFn!: (e: Error) => void;

  const cleanup = () => {
    try {
      server.disconnect();
    } catch {
      // already disconnected
    }
  };

  const finish = (kg: number) => {
    if (settled) return;
    settled = true;
    clearTimeout(handshakeTimer);
    onStatus({ phase: "done", weightKg: kg });
    (teardown ? teardown().catch(() => {}) : Promise.resolve()).finally(cleanup);
    resolveFn(kg);
  };

  const fail = (message: string) => {
    if (settled) return;
    settled = true;
    clearTimeout(handshakeTimer);
    onStatus({ phase: "error", message });
    cleanup();
    rejectFn(new Error(message));
  };

  const markWeight = (kg: number, locked: boolean) => {
    weightKg = kg;
    if (locked) weightLocked = true;
  };

  const promise = new Promise<number>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  const handshakeTimer = setTimeout(() => {
    fail("Scale didn't respond in time. Make sure it's powered on and nearby, then try again.");
  }, HANDSHAKE_TIMEOUT_MS);

  device.addEventListener("gattserverdisconnected", () => {
    if (settled) return;
    if (weightLocked && weightKg > 0) finish(weightKg);
    else fail("Scale disconnected before a stable weight was captured.");
  });

  return {
    promise,
    finish,
    fail,
    markWeight,
    setTeardown: (fn: () => Promise<void>) => {
      teardown = fn;
    },
  };
}

// --- Protocol A: Dr. Trust SSW532 / ICOMON FG2211WB (service FFB0, chars FFB1/FFB2/FFB3) ---

function runSsw532Protocol(
  device: BluetoothDevice,
  server: BluetoothRemoteGATTServer,
  cmdChar: BluetoothRemoteGATTCharacteristic,
  weightChar: BluetoothRemoteGATTCharacteristic,
  bcChar: BluetoothRemoteGATTCharacteristic,
  bodyProfile: BodyProfile,
  onStatus: (s: ScaleStatus) => void,
): Promise<number> {
  const session = createSession(device, server, onStatus);
  const { finish, fail, markWeight } = session;

  let sessionId = 0;
  let isLiveMeasurement = false;
  let pkt0Valid = false;
  let pendingWeightKg = 0;
  let weightLocked = false;

  function checksum(buf: number[]): number {
    let s = 0;
    for (let i = 3; i <= 18; i++) s += buf[i] & 0xff;
    return s % 32;
  }

  async function writeCmd(payload: number[]) {
    payload[19] = checksum(payload);
    await writeValue(cmdChar, Uint8Array.from(payload));
  }

  session.setTeardown(() =>
    writeCmd([0x04, 0x03, 0x00, 0xb0, sessionId & 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  );

  const sendUserProfile = async () => {
    const ts = Math.floor(Date.now() / 1000);
    const h = Math.min(220, Math.max(100, Math.round(bodyProfile.heightCm)));
    const age = Math.min(127, Math.max(0, Math.round(bodyProfile.ageYears)));

    await writeCmd([0x00, 0x03, 0x00, 0xb0, sessionId & 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    await writeCmd([
      0x01, 0x1a, 0x00, 0xb8,
      (ts >>> 24) & 0xff, (ts >>> 16) & 0xff, (ts >>> 8) & 0xff, ts & 0xff,
      0x01, 0x4a, 0x01, h & 0xff, 0x17, 0x70, (0x80 | age) & 0xff, 0x13, 0x88, 0x0f, 0x00, 0,
    ]);
    const icomon = [0x69, 0x63, 0x6f, 0x6d, 0x6f, 0x6e]; // "icomon"
    await writeCmd([0x01, 0x1a, 0x01, 0x00, 0x00, 0x00, 0x06, ...icomon, 0, 0, 0, 0, 0, 0, 0]);
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
      weightLocked = true;
      markWeight(kg, true);
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
        weightChar.startNotifications().catch((e) => fail(`Couldn't subscribe to weight updates: ${describeError(e)}`));
      } else if (b2 === 0x01) {
        onStatus({ phase: "step-on" });
        sendUserProfile().catch((e) => fail(`Couldn't start measurement: ${describeError(e)}`));
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
        if (weightLocked && isLiveMeasurement && pendingWeightKg > 0) {
          finish(pendingWeightKg);
        }
      }
    }
  };

  bcChar.addEventListener("characteristicvaluechanged", onBcChanged);
  bcChar.startNotifications().catch((e) => fail(`Couldn't connect to scale: ${describeError(e)}`));

  return session.promise;
}

// --- Protocol B: SWAN / ICOMON "MGB" family (service FFB0, chars FFB1/FFB2 only) ---
// Includes some Dr. Trust models (e.g. "Smart 505") that stream 8-byte frames
// instead of the 20-byte composite frames SWAN/ICOMON-branded units use.

function runMgbProtocol(
  device: BluetoothDevice,
  server: BluetoothRemoteGATTServer,
  cfgChar: BluetoothRemoteGATTCharacteristic,
  ctrlChar: BluetoothRemoteGATTCharacteristic,
  bodyProfile: BodyProfile,
  onStatus: (s: ScaleStatus) => void,
): Promise<number> {
  const session = createSession(device, server, onStatus);
  const { finish, fail, markWeight } = session;

  async function writeCfg(b2: number, b3: number, b4: number, b5: number) {
    const buf = new Uint8Array(8);
    buf[0] = 0xac;
    buf[1] = 0x02;
    buf[2] = b2 & 0xff;
    buf[3] = b3 & 0xff;
    buf[4] = b4 & 0xff;
    buf[5] = b5 & 0xff;
    buf[6] = 0xcc;
    buf[7] = (buf[2] + buf[3] + buf[4] + buf[5] + buf[6]) & 0xff;
    await writeValue(cfgChar, buf);
  }

  const sendConfig = async () => {
    const h = Math.min(250, Math.max(0, Math.round(bodyProfile.heightCm)));
    const age = Math.min(255, Math.max(0, Math.round(bodyProfile.ageYears)));
    const sexByte = bodyProfile.sex === "female" ? 2 : 1;
    const now = new Date();

    await writeCfg(0xf7, 0, 0, 0);
    await writeCfg(0xfa, 0, 0, 0);
    await writeCfg(0xfb, sexByte, age, h);
    await writeCfg(0xfd, Math.min(99, Math.max(0, now.getFullYear() - 2000)), now.getMonth() + 1, now.getDate());
    await writeCfg(0xfc, now.getHours(), now.getMinutes(), now.getSeconds());
    await writeCfg(0xfe, 6, 1, 0); // unit = kg
    onStatus({ phase: "step-on" });
  };

  const onCtrlChanged = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const d = target.value;
    if (!d) return;

    if (d.byteLength === 20) {
      const b0 = d.getUint8(0);
      const b1 = d.getUint8(1);
      const b2 = d.getUint8(2);
      if (b0 === 0xac && (b1 === 0x02 || b1 === 0x03) && b2 === 0xff) {
        // weight: big-endian uint16 * 0.1 kg at offset 12 (after 3-byte header,
        // 3 unknown bytes, and a 6-byte scale timestamp).
        const kg = d.getUint16(12, false) / 10;
        if (kg > 0) {
          markWeight(kg, true);
          finish(kg);
        }
      }
      return;
    }

    if (d.byteLength === 8) {
      if (d.getUint8(0) !== 0xac || d.getUint8(1) !== 0x02) return;
      const b2 = d.getUint8(2);
      const b3 = d.getUint8(3);
      const b4 = d.getUint8(4);
      const b5 = d.getUint8(5);
      const b6 = d.getUint8(6);
      const chk = d.getUint8(7);
      if (((b2 + b3 + b4 + b5 + b6) & 0xff) !== chk) return;
      if (b4 !== 0 || b5 !== 0) return;

      const kg = ((b2 << 8) | b3) / 100;
      if (kg <= 0) return;
      if (b6 === 0xca) {
        markWeight(kg, true);
        finish(kg);
      } else if (b6 === 0xce) {
        onStatus({ phase: "measuring", weightKg: kg });
      }
    }
  };

  ctrlChar.addEventListener("characteristicvaluechanged", onCtrlChanged);
  ctrlChar
    .startNotifications()
    .then(sendConfig)
    .catch((e) => fail(`Couldn't connect to scale: ${describeError(e)}`));

  return session.promise;
}

// --- Entry point ---

export async function connectScale(bodyProfile: BodyProfile, onStatus: (s: ScaleStatus) => void): Promise<number> {
  if (!isWebBluetoothSupported()) {
    const message = "Web Bluetooth isn't supported in this browser. Use Chrome on Android.";
    onStatus({ phase: "error", message });
    throw new Error(message);
  }

  let device: BluetoothDevice;
  try {
    onStatus({ phase: "requesting" });
    // acceptAllDevices (not a service filter): these scales don't reliably
    // advertise their GATT service UUID in the broadcast packet, so a
    // service filter can leave the picker empty even when the scale is
    // right there.
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID],
    });
  } catch (e) {
    const message =
      e instanceof DOMException && e.name === "NotFoundError"
        ? "No device selected."
        : `Couldn't open the Bluetooth picker: ${describeError(e)}`;
    onStatus({ phase: "error", message });
    throw new Error(message);
  }

  let server: BluetoothRemoteGATTServer;
  let char1: BluetoothRemoteGATTCharacteristic;
  let char2: BluetoothRemoteGATTCharacteristic;
  let char3: BluetoothRemoteGATTCharacteristic | null = null;
  try {
    onStatus({ phase: "connecting" });
    server = await withTimeout(
      device.gatt!.connect(),
      CONNECT_TIMEOUT_MS,
      "Couldn't connect — make sure the scale is on and nearby, then try again.",
    );
    const service = await server.getPrimaryService(SERVICE_UUID);
    char1 = await service.getCharacteristic(CHAR_1);
    char2 = await service.getCharacteristic(CHAR_2);
    try {
      char3 = await service.getCharacteristic(CHAR_3);
    } catch {
      char3 = null;
    }
  } catch (e) {
    const message = `"${device.name ?? "Selected device"}" doesn't look like a supported Dr. Trust scale (${describeError(e)}). Tell the developer this device's exact name so the protocol can be checked.`;
    onStatus({ phase: "error", message });
    try {
      device.gatt?.disconnect();
    } catch {
      // already disconnected
    }
    throw new Error(message);
  }

  // From here on, protocol-level failures are reported by the protocol
  // functions themselves (via session.fail), so they aren't re-wrapped
  // with the generic "doesn't look like a supported scale" message above.
  if (char3) {
    return runSsw532Protocol(device, server, char1, char2, char3, bodyProfile, onStatus);
  }
  return runMgbProtocol(device, server, char1, char2, bodyProfile, onStatus);
}
