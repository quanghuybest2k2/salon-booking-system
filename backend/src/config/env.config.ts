import * as dotenv from 'dotenv';
dotenv.config();

const envConfig = {
  DOMAIN: process.env.DOMAIN ?? 'localhost',
  PORT: +(process.env.PORT ?? 8080),
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: +(process.env.DB_PORT ?? 3306),
  DB_USERNAME: process.env.DB_USERNAME ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_DATABASE: process.env.DB_DATABASE ?? '',
};

export default envConfig;
