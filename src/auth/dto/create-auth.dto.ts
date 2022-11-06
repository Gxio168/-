import { IsNotEmpty, Length } from 'class-validator'

export class CreateAuthDto {
  @IsNotEmpty({ message: '账号不能为空' })
  @Length(6, 16, { message: '账号长度为6-16' })
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 16, { message: '密码长度为6-16' })
  password: string
}
