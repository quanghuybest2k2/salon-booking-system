import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config({
  path: join(__dirname, '..', '..', '..', '.env'),
});

const envConfig = {
  DOMAIN: process.env.DOMAIN ?? 'localhost',
  PORT: +(process.env.PORT ?? 8080),
  DATABASE: {
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: +(process.env.DB_PORT ?? 3306),
    DB_USERNAME: process.env.DB_USERNAME ?? 'root',
    DB_PASSWORD: process.env.DB_PASSWORD ?? '',
    DB_DATABASE: process.env.DB_DATABASE ?? '',
  },
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? '',
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '',
  },
  MAIL: {
    MAIL_HOST: process.env.MAIL_HOST ?? '',
    MAIL_PORT: +(process.env.MAIL_PORT ?? 587),
    MAIL_USER: process.env.MAIL_USER ?? '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD ?? '',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ?? '',
  },
};

export default envConfig;
