import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Auth } from '../decorator/auth.decorator';
import type { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

  @Get('getAuth')
  @Auth()
  getUserInfo(@Req() req: Request) {
    return this.authService.getUserInfo(req)
  }

  // 获取购物车
  @Get('getShopCart')
  @Auth()
  getShopCart(@Req() req: Request) {
    return this.authService.getShopCart(req)
  }

  // 向购物车添加商品
  @Post('addToShopCart')
  @Auth()
  addToShopCart(@Req() req: Request) {
    return this.authService.addToShopCart(req)
  }

  // 从购物车移除商品
  @Post('removeFromShopCart')
  @Auth()
  removeFromShopCart(@Req() req: Request) {
    return this.authService.removeFromShopCart(req)
  }

  // 改变购物车中的商品数量
  @Post('changeShopNum')
  @Auth()
  changeShopNum(@Req() req: Request) {
    return this.authService.changeShopNum(req)
  }

  @Post('addToOrder')
  @Auth()
  addToOrder(@Req() req: Request) {
    return this.authService.addToOrder(req)
  }

  @Get('getOrder')
  @Auth()
  getOrder(@Req() req: Request) {
    return this.authService.getOrder(req)
  }

  @Get('getCollect')
  @Auth()
  getCollect(@Req() req) {
    return this.authService.getCollect(req)
  }

  @Post('addToCollect')
  @Auth()
  addToCollect(@Req() req) {
    return this.authService.addToCollect(req)
  }

  @Post('removeFromCollect')
  @Auth()
  removeFromCollect(@Req() req) {
    return this.authService.removeFromCollect(req)
  }

  @Post('checkCollect')
  @Auth()
  checkCollect(@Req() req) {
    return this.authService.checkCollect(req)
  }
}
