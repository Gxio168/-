import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ValidateExceptionFilter } from './common/filter'
import { Response } from './common/response'
import * as session from 'express-session'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      // 管道验证
      // 暂时关闭
      disableErrorMessages: false
    })
  )
  app.useGlobalFilters(new ValidateExceptionFilter()) // 处理请求过程中的错误
  app.useGlobalInterceptors(new Response()) // 处理最终返回的结果，进行一层包装
  app.enableCors() // 允许跨域
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/picture'
  })
  app.use(
    session({
      secret: 'gxio666',
      name: 'gxio',
      rolling: true,
      cookie: { maxAge: null }
    })
  )
  await app.listen(3000)
}
bootstrap()
