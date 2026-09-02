// Whoop API v2 client. Docs: https://developer.whoop.com/api/
// OAuth2 authorization-code flow — register an app at
// https://developer.whoop.com (Developer Dashboard) with redirect URI
// matching WHOOP_REDIRECT_URI, then set WHOOP_CLIENT_ID/WHOOP_CLIENT_SECRET.

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const API_BASE = "https://api.prod.whoop.com/developer";
const SCOPES = "read:cycles read:recovery read:sleep read:workout offline";
const KJ_PER_KCAL = 4.184;

export function getWhoopRedirectUri(requestUrl: string): string {
  return process.env.WHOOP_REDIRECT_URI || new URL("/api/whoop/callback", requestUrl).toString();
}

export function buildAuthorizeUrl(requestUrl: string, state: string): string {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID!);
  url.searchParams.set("redirect_uri", getWhoopRedirectUri(requestUrl));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", state);
  return url.toString();
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
};

export async function exchangeCodeForTokens(code: string, requestUrl: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.WHOOP_CLIENT_ID!,
      client_secret: process.env.WHOOP_CLIENT_SECRET!,
      redirect_uri: getWhoopRedirectUri(requestUrl),
    }),
  });

  if (!res.ok) {
    throw new Error(`Whoop token exchange failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function refreshTokens(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.WHOOP_CLIENT_ID!,
      client_secret: process.env.WHOOP_CLIENT_SECRET!,
      scope: SCOPES,
    }),
  });

  if (!res.ok) {
    throw new Error(`Whoop token refresh failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as TokenResponse;
}

/** Local (IST) calendar date for a Whoop UTC timestamp — matches the rest of the app. */
function localDate(isoTimestamp: string): string {
  return new Date(isoTimestamp).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

async function fetchPaginated<T>(
  accessToken: string,
  path: string,
  startIso: string,
  endIso: string
): Promise<T[]> {
  const results: T[] = [];
  let nextToken: string | undefined;

  do {
    const url = new URL(`${API_BASE}${path}`);
    url.searchParams.set("start", startIso);
    url.searchParams.set("end", endIso);
    url.searchParams.set("limit", "25");
    if (nextToken) url.searchParams.set("nextToken", nextToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Whoop fetch ${path} failed: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as { records: T[]; next_token?: string };
    results.push(...data.records);
    nextToken = data.next_token;
  } while (nextToken);

  return results;
}

type WhoopCycle = {
  start: string;
  end: string | null;
  score_state: string;
  score?: { strain?: number; kilojoule?: number };
};

export type ParsedCycle = {
  date: string;
  caloriesBurned: number;
  strain: number | null;
  cycleStart: Date;
  cycleEnd: Date | null;
};

/** Fetch all Whoop cycles between start/end (inclusive), paginating as needed. */
export async function fetchCycles(
  accessToken: string,
  startIso: string,
  endIso: string
): Promise<ParsedCycle[]> {
  const records = await fetchPaginated<WhoopCycle>(accessToken, "/v2/cycle", startIso, endIso);

  return records
    .filter((c) => c.score_state === "SCORED" && c.score?.kilojoule !== undefined)
    .map((c) => ({
      date: localDate(c.start),
      caloriesBurned: c.score!.kilojoule! / KJ_PER_KCAL,
      strain: c.score?.strain ?? null,
      cycleStart: new Date(c.start),
      cycleEnd: c.end ? new Date(c.end) : null,
    }));
}

type WhoopRecovery = {
  created_at: string;
  score_state: string;
  score?: {
    recovery_score?: number;
    hrv_rmssd_milli?: number;
    resting_heart_rate?: number;
  };
};

export type ParsedRecovery = {
  date: string;
  recoveryScore: number | null;
  hrvMs: number | null;
  restingHeartRate: number | null;
};

/** Fetch Whoop recovery scores between start/end. Keyed by the recovery's created_at date. */
export async function fetchRecovery(
  accessToken: string,
  startIso: string,
  endIso: string
): Promise<ParsedRecovery[]> {
  const records = await fetchPaginated<WhoopRecovery>(
    accessToken,
    "/v2/recovery",
    startIso,
    endIso
  );

  return records
    .filter((r) => r.score_state === "SCORED")
    .map((r) => ({
      date: localDate(r.created_at),
      recoveryScore: r.score?.recovery_score ?? null,
      hrvMs: r.score?.hrv_rmssd_milli ?? null,
      restingHeartRate: r.score?.resting_heart_rate ?? null,
    }));
}

type WhoopSleep = {
  start: string;
  nap: boolean;
  score_state: string;
  score?: {
    sleep_performance_percentage?: number;
    stage_summary?: {
      total_light_sleep_time_milli?: number;
      total_slow_wave_sleep_time_milli?: number;
      total_rem_sleep_time_milli?: number;
    };
  };
};

export type ParsedSleep = {
  date: string;
  sleepPerformancePct: number | null;
  sleepMinutes: number | null;
};

/** Fetch Whoop sleep sessions between start/end, excluding naps. */
export async function fetchSleep(
  accessToken: string,
  startIso: string,
  endIso: string
): Promise<ParsedSleep[]> {
  const records = await fetchPaginated<WhoopSleep>(
    accessToken,
    "/v2/activity/sleep",
    startIso,
    endIso
  );

  return records
    .filter((s) => s.score_state === "SCORED" && !s.nap)
    .map((s) => {
      const stages = s.score?.stage_summary;
      const asleepMilli =
        (stages?.total_light_sleep_time_milli ?? 0) +
        (stages?.total_slow_wave_sleep_time_milli ?? 0) +
        (stages?.total_rem_sleep_time_milli ?? 0);

      return {
        date: localDate(s.start),
        sleepPerformancePct: s.score?.sleep_performance_percentage ?? null,
        sleepMinutes: asleepMilli > 0 ? asleepMilli / 60000 : null,
      };
    });
}

type WhoopWorkout = {
  start: string;
  sport_name: string;
  score_state: string;
};

/** Whoop sport names arrive as snake_case codes (e.g. "weightlifting_msk") — clean them up for display. */
function humanizeSportName(sportName: string): string {
  return sportName
    .replace(/_msk$|_v\d+$/i, "")
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export type ParsedWorkoutDay = {
  date: string;
  count: number;
  summary: string;
};

/** Fetch Whoop workouts between start/end, aggregated into a per-day count + activity summary. */
export async function fetchWorkoutDays(
  accessToken: string,
  startIso: string,
  endIso: string
): Promise<ParsedWorkoutDay[]> {
  const records = await fetchPaginated<WhoopWorkout>(
    accessToken,
    "/v2/activity/workout",
    startIso,
    endIso
  );

  const byDate = new Map<string, string[]>();
  for (const w of records) {
    if (w.score_state !== "SCORED") continue;
    const date = localDate(w.start);
    const list = byDate.get(date) ?? [];
    list.push(humanizeSportName(w.sport_name));
    byDate.set(date, list);
  }

  return Array.from(byDate.entries()).map(([date, sports]) => ({
    date,
    count: sports.length,
    summary: Array.from(new Set(sports)).join(", "),
  }));
}
