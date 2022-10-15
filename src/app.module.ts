import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { UtilsModule } from './utils/utils.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true    // 全局注册
  }), UtilsModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
