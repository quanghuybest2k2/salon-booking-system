import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorMessages } from 'src/common/constants/messages';
import { MetaKey } from 'src/common/constants/meta-key.constant';
import { UserRole } from 'src/common/enums';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(MetaKey.ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (this.hasRole(user, roles)) {
      return true;
    }

    throw new ForbiddenException(ErrorMessages.PERMISSION_DENIED);
  }

  private hasRole(user: User, roles: UserRole[]): boolean {
    if (!user || !user.role) {
      return false;
    }

    return roles.includes(user.role);
  }
}
