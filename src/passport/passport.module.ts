import { Module } from '@nestjs/common';
import { PassportService } from './passport.service';
import { PassportController } from './passport.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PassportController],
  providers: [PassportService, PrismaService],
})
export class PassportModule {}
