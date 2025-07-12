import { DataSourceOptions } from 'typeorm';
import envConfig from './env.config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_DATABASE,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'], // .ts for development, .js for production
  migrations: [__dirname + '/../migrations/*.js'],
  subscribers: [],
  migrationsRun: false,
};
