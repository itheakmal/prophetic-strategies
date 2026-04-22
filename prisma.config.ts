import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'mysql://u705371345_prophetic_stra:Khan_2468@localhost:3306/u705371345_prophetic_stra',
  },
});
