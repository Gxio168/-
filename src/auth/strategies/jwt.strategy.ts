import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('TOKEN_SECRET')
    })
  }
  async validate({ sub: id }) {
    // 获取 data 中的 sub 属性
    return this.prisma.user.findUnique({
      // 从数据库获取对应用户数据返回, 过滤掉密码
      select: { id: true, username: true },
      where: { id }
    })
  }
}
