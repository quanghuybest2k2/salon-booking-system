import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseHandler } from 'src/utils/ResponseHandler';
import { RoleRequired } from 'src/common/decorators/roles.decorator';
import { SortField, SortOrder, UserRole } from 'src/common/enums';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiBearerAuth()
  @RoleRequired([UserRole.CUSTOMER])
  @ApiBody({
    type: CreateAppointmentDto,
    description: 'Thông tin tạo cuộc hẹn',
  })
  @ApiResponse({ status: 201, description: 'Tạo cuộc hẹn thành công' })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.appointmentService.create(createAppointmentDto);
    return ResponseHandler.responseSuccess(
      res,
      result,
      'Appointment created successfully',
    );
  }

  @Get()
  @ApiBearerAuth()
  @RoleRequired([UserRole.ADMIN, UserRole.PROVIDER])
  @ApiQuery({ name: 'pageNumber', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'sortField', enum: SortField, required: false })
  @ApiQuery({ name: 'sortOrder', enum: SortOrder, required: false })
  async findAll(
    @Query('pageNumber') pageNumber = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sortField') sortField = SortField.CREATED_AT,
    @Query('sortOrder') sortOrder = SortOrder.DESC,
    @Res() res: Response,
  ): Promise<Response> {
    const req = {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      sortField,
      sortOrder,
      relations: ['customer', 'provider', 'service'],
    };

    const result = await this.appointmentService.findAll(req);
    return ResponseHandler.responseSuccess(
      res,
      { appointments: result, total: result.length },
      'Fetched all appointments successfully',
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @RoleRequired([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER])
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Appointment ID',
    required: true,
    example: 1,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.appointmentService.findOne(id);
    return ResponseHandler.responseSuccess(
      res,
      result,
      'Fetched appointment successfully',
    );
  }

  @Put(':id')
  @ApiBearerAuth()
  @RoleRequired([UserRole.CUSTOMER, UserRole.PROVIDER])
  @ApiBody({
    type: UpdateAppointmentDto,
    description: 'Thông tin tạo cuộc hẹn',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.appointmentService.update(id, updateDto);
    return ResponseHandler.responseSuccess(
      res,
      result,
      'Updated appointment successfully',
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @RoleRequired([UserRole.CUSTOMER, UserRole.PROVIDER])
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<Response> {
    await this.appointmentService.remove(id);
    return ResponseHandler.responseSuccess(
      res,
      null,
      'Deleted appointment successfully',
    );
  }
}
