import { prisma } from "@/lib/prisma";

export async function getProfile(userId: string) {
  return prisma.profile.findUniqueOrThrow({ where: { id: userId } });
}
