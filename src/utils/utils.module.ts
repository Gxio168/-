import { Module } from '@nestjs/common'
import { utilsService } from './utils.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [utilsService, PrismaService],
  exports: [utilsService]
})
export class UtilsModule {}
