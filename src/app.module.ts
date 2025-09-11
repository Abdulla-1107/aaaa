import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { FraudsterModule } from './fraudster/fraudster.module';
import { PassportModule } from './passport/passport.module';

@Module({
  imports: [UserModule, PrismaModule, FraudsterModule, PassportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
