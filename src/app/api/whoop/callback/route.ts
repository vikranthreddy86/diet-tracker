import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens } from "@/lib/whoop";
import { syncCyclesForUser } from "@/lib/whoopSync";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const expectedState = request.cookies.get("whoop_oauth_state")?.value;

  if (error) {
    return NextResponse.redirect(
      new URL(`/progress?whoopError=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/progress?whoopError=invalid_state", request.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, request.url);

    await prisma.whoopConnection.upsert({
      where: { userId: user.id },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
      },
      create: {
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
      },
    });

    await syncCyclesForUser(user.id, tokens.access_token);
  } catch (err) {
    console.error("Whoop OAuth callback failed:", err);
    return NextResponse.redirect(new URL("/progress?whoopError=connect_failed", request.url));
  }

  const response = NextResponse.redirect(new URL("/progress?whoopConnected=1", request.url));
  response.cookies.delete("whoop_oauth_state");
  return response;
}
