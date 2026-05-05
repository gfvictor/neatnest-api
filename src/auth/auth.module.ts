import { Module } from '@nestjs/common';
import { SupabaseAuthStrategy } from './supabase-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [SupabaseAuthStrategy],
  controllers: [],
  exports: [PassportModule, SupabaseAuthStrategy],
})
export class AuthModule {}
