import { Module } from '@nestjs/common';
import { FraudsterService } from './fraudster.service';
import { FraudsterController } from './fraudster.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [FraudsterController],
  providers: [FraudsterService, PrismaService, UserService],
})
export class FraudsterModule {}
