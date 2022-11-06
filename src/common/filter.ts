import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import type { Response, Request } from 'express'

@Catch(HttpException)
export class ValidateExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    // 自定义异常处理
    if (exception instanceof BadRequestException) {
      return response.json(exception.getResponse())
    }
    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toString(),
      message: exception.message,
      path: request.url
    })
  }
}
