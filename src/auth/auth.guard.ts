// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token topilmadi');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token noto‘g‘ri formatda');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secret', // .env fayldan secret
      });

      // payloadni requestga qo‘shib qo‘yamiz
      request['user'] = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token yaroqsiz yoki muddati tugagan');
    }
  }
}
