import { SetMetadata } from '@nestjs/common';
import { MetaKey } from '../constants/meta-key.constant';
import { UserRole } from '../enums';

export const RoleRequired = (role: UserRole[]) =>
  SetMetadata(MetaKey.ROLE, role);
