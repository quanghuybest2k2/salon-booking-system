import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth/auth.repository';
import envConfig from 'src/config/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConfig.JWT.JWT_SECRET ?? '',
    });
  }

  async validate(payload: any) {
    const user = await this.authRepository.findByEmail(payload.email);
    if (!user) {
      return null;
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
