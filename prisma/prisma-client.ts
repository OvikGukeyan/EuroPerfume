import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  // Each serverless instance must use a small pool; the database pooler is shared
  // across routes, deployments and other applications.
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
    min: 0,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 10000,
    maxLifetimeSeconds: 60,
    allowExitOnIdle: true,
  });
  return new PrismaClient({ adapter });
}

// Reuse in production as well as development. Do not allocate an unused
// adapter/pool when a client already exists in this runtime.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

export default prisma;
