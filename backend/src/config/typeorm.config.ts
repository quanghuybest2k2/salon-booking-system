import { DataSourceOptions } from 'typeorm';
import envConfig from './env.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: envConfig.DATABASE.DB_HOST,
  port: envConfig.DATABASE.DB_PORT,
  username: envConfig.DATABASE.DB_USERNAME,
  password: envConfig.DATABASE.DB_PASSWORD,
  database: envConfig.DATABASE.DB_DATABASE,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'], // .ts for development, .js for production
  migrations: [__dirname + '/../migrations/*.js'],
  subscribers: [],
  migrationsRun: false,
};
