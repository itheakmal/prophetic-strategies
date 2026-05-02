import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { mariadbAdapterUrlFromDatabaseUrl } from '@/lib/db/mariadb-url';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const connectionString =
  process.env.DATABASE_URL ??
  'mysql://root:root@localhost:3306/prophetic_strategies';
const adapter = new PrismaMariaDb(mariadbAdapterUrlFromDatabaseUrl(connectionString));

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
