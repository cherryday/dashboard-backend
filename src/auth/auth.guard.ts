import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }

    const token = request.headers.authorization.replace('Bearer ', '');

    try {
      const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
