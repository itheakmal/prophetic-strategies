import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const connectionString =
  process.env.DATABASE_URL ??
  'mysql://root:root@localhost:3306/prophetic_strategies';
const adapter = new PrismaMariaDb(
  connectionString.startsWith('mysql://')
    ? connectionString.replace('mysql://', 'mariadb://')
    : connectionString
);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
