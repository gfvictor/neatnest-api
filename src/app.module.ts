import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HouseholdModule } from './household/household.module';
import { RoomModule } from './room/room.module';
import { WorkplaceModule } from './workplace/workplace.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    HouseholdModule,
    RoomModule,
    WorkplaceModule,
    SectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
