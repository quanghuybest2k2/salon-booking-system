import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/register.request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.request.dto';
import { ResponseHandler } from '../../utils/ResponseHandler';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { Logger } from 'src/logger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterRequestDto,
    description: 'Register a new user with username, email, and password',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(
    @Res() res: Response,
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<void> {
    try {
      const result = await this.authService.register(registerRequestDto);
      ResponseHandler.responseSuccess(
        res,
        result,
        'User registered successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error('An error occurred', error);
      ResponseHandler.responseError(
        res,
        error,
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Login with email and password',
  })
  @ApiBody({
    type: LoginRequestDto,
    description: 'Login user with email and password',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Res() res: Response,
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<void> {
    try {
      const userValidate = await this.authService.validateUser(
        loginRequestDto.email,
        loginRequestDto.password,
      );
      if (!userValidate) {
        ResponseHandler.responseError(
          res,
          null,
          'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = await this.authService.login(userValidate as any);
      ResponseHandler.responseSuccess(
        res,
        user,
        'Login successful',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('An error occurred', error);
      ResponseHandler.responseError(
        res,
        error,
        error.message || 'Login failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh access token using refresh token',
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Res() res: Response,
    @Body()
    refreshTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<void> {
    try {
      const refresh_token = await this.authService.refreshToken(
        refreshTokenRequestDto.refreshToken,
      );
      ResponseHandler.responseSuccess(
        res,
        refresh_token,
        'Token refreshed successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('An error occurred', error);
      ResponseHandler.responseError(
        res,
        error,
        error.message || 'Invalid refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
