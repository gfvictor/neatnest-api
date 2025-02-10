import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PersonModule } from './person/person.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PersonModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
