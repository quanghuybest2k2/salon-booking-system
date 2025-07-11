import { Injectable } from '@nestjs/common';
import {
  LessThan,
  DataSource,
  FindOptionsWhere,
  FindOneOptions,
  Not,
} from 'typeorm';
import { User } from '../../entities/user/user.entity';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class AuthRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  /**
   * Finds one entity by condition or RefreshToken.
   */
  async findByRefreshToken(
    refreshToken: string,
    options?: Omit<FindOneOptions<User>, 'where'>,
  ): Promise<User | null> {
    return this.findOne({
      where: { refreshToken } as unknown as FindOptionsWhere<User>,
      ...options,
      select: ['id', 'email', 'refreshToken', 'refreshTokenExpiry'],
    });
  }

  // Delete expired refresh tokens
  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.update(
      { refreshTokenExpiry: LessThan(new Date()) },
      {
        refreshToken: '',
        refreshTokenExpiry: new Date(0), // Set to epoch time
      },
    );
  }

  // Find users with expired refresh tokens
  async findUsersWithExpiredTokens(): Promise<User[]> {
    return await this.find({
      where: {
        refreshTokenExpiry: LessThan(new Date()),
        refreshToken: Not(''), // Refresh token not empty
      },
      select: ['id', 'email', 'refreshTokenExpiry'],
    });
  }
}
