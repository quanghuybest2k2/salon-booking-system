import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseHandler } from '../../utils/ResponseHandler';
import { MailService } from './mail.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('mails')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get(':email')
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email address to send',
    required: true,
    example: 'abc@gmail.com',
  })
  @Public()
  async sendSMTP(
    @Param('email') email: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.mailService.SendMailSMTP(email);
    return ResponseHandler.responseSuccess(
      res,
      data,
      'Send mail with smtp successfully',
    );
  }
}
