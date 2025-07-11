import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'nest_db',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/../entities/**/*.entity.{ts,js}'], // .ts for development, .js for production
  migrations: [__dirname + '/../migrations/*.js'],
  subscribers: [],
  migrationsRun: false,
};
