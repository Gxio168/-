import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface Data<T> {
  data: T
}

@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(map(data => {
      return {
        data,
        statusCode: 200,
        message: '成功',
      }
    }))
  }
}