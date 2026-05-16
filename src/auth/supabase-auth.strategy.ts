import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupabaseAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    app_metadata: { role: 'USER' | 'ADMIN' | 'TESTER' };
    user_metadata?: { name?: string };
  }) {
    let user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      const fullName =
        payload.user_metadata?.name || payload.email.split('@')[0];
      const firstName = fullName.split(' ')[0];
      const household = await this.prisma.household.create({ data: {} });
      const workplace = await this.prisma.workplace.create({ data: {} });

      try {
        user = await this.prisma.user.create({
          data: {
            id: payload.sub,
            email: payload.email,
            name: firstName,
            role: payload.app_metadata?.role || 'USER',
            householdId: household.id,
            workplaceId: workplace.id,
          },
        });
      } catch (err) {
        console.error('Failed to auto-provision user: ', err);
        throw new UnauthorizedException('Error creating user profile.');
      }
    }

    return user;
  }
}
