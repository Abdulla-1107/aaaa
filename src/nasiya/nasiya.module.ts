import { Module } from '@nestjs/common';
import { NasiyaService } from './nasiya.service';
import { NasiyaController } from './nasiya.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportService } from 'src/passport/passport.service';

@Module({
  controllers: [NasiyaController],
  providers: [NasiyaService, PrismaService, PassportService],
})
export class NasiyaModule {}
