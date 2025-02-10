import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [AuthModule],
  providers: [PersonService, JwtAuthGuard],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
