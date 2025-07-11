import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

export const AppDataSource = new DataSource(typeOrmConfig);
