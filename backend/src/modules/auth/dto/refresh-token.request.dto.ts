import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'eyJhbGciOi.......' })
  @IsString({ message: 'Refresh token phải là chuỗi' })
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}
