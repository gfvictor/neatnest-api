import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class SupabaseAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SUPABASE_JWT_SECRET'),
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    app_metadata: { role: 'USER' | 'ADMIN' | 'TESTER' };
  }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.app_metadata?.role || 'USER',
    };
  }
}
