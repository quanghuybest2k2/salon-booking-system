import { SetMetadata } from '@nestjs/common';
import { MetaKey } from '../constants/meta-key.constant';

export const Public = () => SetMetadata(MetaKey.SKIP_AUTH, true);
