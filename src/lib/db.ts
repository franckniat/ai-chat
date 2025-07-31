// lib/prisma.ts
import { PrismaClient } from "@niato-ai/prisma-client";
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());
export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
