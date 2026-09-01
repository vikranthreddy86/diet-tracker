"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { refreshTokens } from "@/lib/whoop";
import { syncCyclesForUser } from "@/lib/whoopSync";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

async function getValidAccessToken(userId: string): Promise<string | null> {
  const connection = await prisma.whoopConnection.findUnique({ where: { userId } });
  if (!connection) return null;

  if (connection.expiresAt.getTime() > Date.now() + 60_000) {
    return connection.accessToken;
  }

  const refreshed = await refreshTokens(connection.refreshToken);
  await prisma.whoopConnection.update({
    where: { userId },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token,
      expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      scope: refreshed.scope,
    },
  });

  return refreshed.access_token;
}

export async function syncWhoopNow() {
  const userId = await requireUserId();
  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) throw new Error("Whoop not connected");

  await syncCyclesForUser(userId, accessToken);

  revalidatePath("/progress");
  revalidatePath("/");
}

export async function disconnectWhoop() {
  const userId = await requireUserId();
  await prisma.whoopConnection.delete({ where: { userId } }).catch(() => {});
  revalidatePath("/progress");
  revalidatePath("/");
}
