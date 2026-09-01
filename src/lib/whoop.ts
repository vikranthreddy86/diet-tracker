// Whoop API v2 client. Docs: https://developer.whoop.com/api/
// OAuth2 authorization-code flow — register an app at
// https://developer.whoop.com (Developer Dashboard) with redirect URI
// matching WHOOP_REDIRECT_URI, then set WHOOP_CLIENT_ID/WHOOP_CLIENT_SECRET.

const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const API_BASE = "https://api.prod.whoop.com/developer";
const SCOPES = "read:cycles offline";
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

type WhoopCycle = {
  id: number;
  start: string;
  end: string | null;
  score_state: string;
  score?: {
    strain?: number;
    kilojoule?: number;
  };
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
  const results: ParsedCycle[] = [];
  let nextToken: string | undefined;

  do {
    const url = new URL(`${API_BASE}/v2/cycle`);
    url.searchParams.set("start", startIso);
    url.searchParams.set("end", endIso);
    url.searchParams.set("limit", "25");
    if (nextToken) url.searchParams.set("nextToken", nextToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Whoop cycles fetch failed: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as { records: WhoopCycle[]; next_token?: string };

    for (const cycle of data.records) {
      if (cycle.score_state !== "SCORED" || cycle.score?.kilojoule === undefined) continue;

      // Local calendar date the cycle started on (IST — matches the rest of the app).
      const date = new Date(cycle.start).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

      results.push({
        date,
        caloriesBurned: cycle.score.kilojoule / KJ_PER_KCAL,
        strain: cycle.score.strain ?? null,
        cycleStart: new Date(cycle.start),
        cycleEnd: cycle.end ? new Date(cycle.end) : null,
      });
    }

    nextToken = data.next_token;
  } while (nextToken);

  return results;
}
