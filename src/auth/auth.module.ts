import { Module } from '@nestjs/common';
import { SupabaseAuthStrategy } from './supabase-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
  ],
  providers: [SupabaseAuthStrategy],
  controllers: [],
  exports: [PassportModule, SupabaseAuthStrategy],
})
export class AuthModule {}
