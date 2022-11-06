import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common'
import { AppService } from './app.service'
import { utilsService } from './utils/utils.service'
import { Response, Request } from 'express'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly utilsService: utilsService
  ) {}

  @Get('getCode')
  getCode(@Session() session, @Res() res: Response) {
    return this.utilsService.generateCode(session, res)
  }

  @Post('validateCode')
  validateCode(@Session() session, @Req() req) {
    return this.utilsService.validateCode(session, req)
  }

  @Get('getCarousel')
  getCarousel() {
    Object.defineProperty
    return this.utilsService.getCarousel()
  }
}
