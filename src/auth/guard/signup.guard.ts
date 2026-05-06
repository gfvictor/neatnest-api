import { Injectable, CanActivate, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(): boolean {
    const isPublicSignupOpen =
      this.configService.get<string>('ALLOW_PUBLIC_SIGNUP') === 'true';

    if (!isPublicSignupOpen) {
      throw new ForbiddenException(
        'Beta teste fechado. Criação de usuários apenas por convite. Entre em contato com o Admin em: gfvictor@pm.me',
      );
    }

    return true;
  }
}
