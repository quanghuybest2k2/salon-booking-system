import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseHandler } from '../../utils/ResponseHandler';
import { UsersService } from './users.service';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';
import { RoleRequired } from 'src/common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @RoleRequired([UserRole.ADMIN, UserRole.PROVIDER])
  async getUsers(@Res() res: Response): Promise<Response> {
    const data = await this.usersService.all();
    return ResponseHandler.responseSuccess(
      res,
      data,
      'Get all users successfully',
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id of the user',
    required: true,
    example: 1,
  })
  async getUserId(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.usersService.findById(id);
    return ResponseHandler.responseSuccess(res, data, 'Get user successfully');
  }
}
