import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "../constants/auth-options";
import { prisma } from "@/prisma/prisma-client";

export async function getUserSession() {
  const session = await getServerSession(authOptions);

  if (!session ) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
  });

  // Read the current database role so revoked admin access cannot survive in a stale JWT.
  return user ? { ...session.user, role: user.role } : null;
}