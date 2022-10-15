import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({   // 注册 JWT 组件，调用 configService 从 .env 文件中获取数据
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('TOKEN_SECRET'),
          signOptions: { expiresIn: '3h' }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, PrismaService]
})
export class AuthModule { }
