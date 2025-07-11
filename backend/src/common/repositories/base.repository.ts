import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  DataSource,
  ObjectLiteral,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(entity: new () => T, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  /**
   * Finds all entities with optional filters, pagination, and order.
   */
  async findAll(options?: {
    where?: FindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.find({
      where: options?.where,
      order: options?.order,
      skip: options?.skip,
      take: options?.take,
    });
  }

  /**
   * Finds one entity by condition or ID.
   */
  async findById(
    id: number | string,
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      ...options,
    });
  }

  /**
   * Finds one entity by condition or Email.
   */

  async findByEmail(
    email: string,
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.findOne({
      where: { email } as unknown as FindOptionsWhere<T>,
      ...options,
    });
  }

  /**
   * Creates and saves an entity.
   */
  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return this.save(entity);
  }

  /**
   * Updates an entity by ID and returns the updated entity.
   */
  async updateEntity(
    id: number | string,
    data: DeepPartial<T>,
  ): Promise<T | null> {
    await this.update(id, data as QueryDeepPartialEntity<T>);
    return this.findById(id);
  }

  /**
   * Deletes an entity by ID.
   */
  async deleteEntity(id: number | string): Promise<void> {
    await this.delete(id);
  }

  /**
   * Finds entities with flexible query.
   */
  async findWithOptions(options: FindManyOptions<T>): Promise<T[]> {
    return this.find(options);
  }

  /**
   * Finds one entity with flexible condition.
   */
  async findOneWithOptions(options: FindOneOptions<T>): Promise<T | null> {
    return this.findOne(options);
  }
}
