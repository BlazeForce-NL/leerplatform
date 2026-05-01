import { PrismaClient } from "@prisma/client";

// Singleton to prevent multiple PrismaClient instances during Next.js hot reload.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
