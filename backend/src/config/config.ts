import * as dotenv from 'dotenv';
import path from 'path';

if (!process.env.LOADED_ENV) {
  const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
  const envPath = path.resolve(__dirname, envFilePath);

  dotenv.config({ path: envPath });
  process.env.LOADED_ENV = 'true';  // Set a flag to ensure it loads only once
  console.log(`Environment variables loaded from: ${envPath}`);
}
