import { Injectable, Session, Res, Req, BadRequestException } from '@nestjs/common'
import * as svgCaptcha from 'svg-captcha'
import { Response, Request } from 'express'
import { PrismaService } from '../prisma/prisma.service'
import { join } from 'path'

@Injectable()
export class utilsService {
  constructor(private prisma: PrismaService) {}
  // 生成验证码
  generateCode(@Session() session, @Res() res: Response) {
    const captcha = svgCaptcha.create({
      size: 4,
      width: 100,
      height: 60,
      background: '#fbab7e'
    })
    session.code = captcha.text
    res.type('svg')
    res.status(200).send(captcha.data)
  }

  // 验证码的验证
  validateCode(@Session() session, @Req() req: Request) {
    if (req.body.code && req.body.code.toLocaleLowerCase() === session.code.toLocaleLowerCase()) {
      return {
        data: true
      }
    } else {
      throw new BadRequestException('验证码错误')
    }
  }

  // 返回轮播图信息
  getCarousel() {
    const carouselImgs = {}
    for (let i = 0; i < 4; i++) {
      carouselImgs[`${i}`] = {
        id: i,
        imgUrl: `/picture/cms_${i + 1}.jpg`
      }
    }
    return {
      carouselImgs
    }
  }
}
