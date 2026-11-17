import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.serive.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
