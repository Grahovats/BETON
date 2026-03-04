import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'ENCRYPTION_KEY'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  dbUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  encryptionKey: process.env.ENCRYPTION_KEY as string,
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};
