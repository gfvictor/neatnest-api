import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [PrismaModule, PersonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
