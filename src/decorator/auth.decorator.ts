import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// applyDecorators 用于合并多个装饰器

export const Auth = () => applyDecorators(UseGuards(AuthGuard('jwt')))
