import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import envConfig from 'src/config/env.config';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user/user.entity';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  private generateAccessToken(email: string, userId: number): string {
    const payload = { email, sub: userId };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(email: string, userId: number): string {
    const payload = { email, sub: userId, type: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: envConfig.JWT.JWT_REFRESH_SECRET ?? '',
      expiresIn: envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
    });
  }

  private getRefreshTokenExpiryDate(): Date {
    const expiresInConfig = envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN ?? '7d';
    // Parse expiry time (support formats like '7d', '24h', '30m', etc.)
    const match = expiresInConfig.match(/^(\d+)([dhm])$/);
    if (!match) {
      // Default to 7 days if format is invalid
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    let milliseconds = 0;
    switch (unit) {
      case 'd':
        milliseconds = value * 24 * 60 * 60 * 1000;
        break;
      case 'h':
        milliseconds = value * 60 * 60 * 1000;
        break;
      case 'm':
        milliseconds = value * 60 * 1000;
        break;
      default:
        milliseconds = 7 * 24 * 60 * 60 * 1000; // Default 7 days
    }

    return new Date(Date.now() + milliseconds);
  }

  async register(registerRequestDto: RegisterRequestDto): Promise<User> {
    const { email, password, username } = registerRequestDto;

    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = hashedPassword;

    //Save user to database
    const savedUser = await this.authRepository.save(user);

    // Generate refresh token
    const refreshToken = this.generateRefreshToken(
      savedUser.email,
      savedUser.id,
    );
    const refreshTokenExpiry = this.getRefreshTokenExpiryDate();

    // Update user with refresh token and expiry
    await this.authRepository.update(savedUser.id, {
      refreshToken,
      refreshTokenExpiry,
    });
    savedUser.refreshToken = refreshToken;
    savedUser.refreshTokenExpiry = refreshTokenExpiry;

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const accessToken = this.generateAccessToken(user.email, user.id);
    const refreshToken = this.generateRefreshToken(user.email, user.id);
    const refreshTokenExpiry = this.getRefreshTokenExpiryDate();

    await this.authRepository.update(user.id, {
      refreshToken,
      refreshTokenExpiry,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify JWT token
      const payload = await this.jwtService.verify(refreshToken, {
        secret: envConfig.JWT.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user by refresh token
      const user = await this.authRepository.findByRefreshToken(refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if refresh token is expired in database
      if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
        // Clean up expired token
        await this.authRepository.update(user.id, {
          refreshToken: '',
          refreshTokenExpiry: new Date(0), // Set expiry to epoch time
        });
        throw new UnauthorizedException('Refresh token has expired');
      }

      const newAccessToken = this.generateAccessToken(user.email, user.id);
      const newRefreshToken = this.generateRefreshToken(user.email, user.id);
      const newRefreshTokenExpiry = this.getRefreshTokenExpiryDate();

      // Update database with new refresh token and expiry
      await this.authRepository.update(user.id, {
        refreshToken: newRefreshToken,
        refreshTokenExpiry: newRefreshTokenExpiry,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Method to logout user (clear refresh token)
  async logout(userId: number): Promise<void> {
    await this.authRepository.update(userId, {
      refreshToken: '',
      refreshTokenExpiry: new Date(0), // Set expiry to epoch time
    });
  }

  // Method to clean up expired refresh tokens (can be run as a scheduled job)
  async cleanupExpiredTokens(): Promise<void> {
    await this.authRepository.deleteExpiredRefreshTokens();
  }
}
