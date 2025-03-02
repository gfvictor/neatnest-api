import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HouseholdService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { householdId: true },
    });

    if (!user?.householdId)
      throw new NotFoundException('Household not found for this user');

    return this.prisma.household.findUnique({
      where: { id: user.householdId },
    });
  }

  async findOneById(id: string) {
    const household = await this.prisma.household.findUnique({ where: { id } });
    if (!household) throw new NotFoundException('Household not found');

    return household;
  }

  async update(userId: string, data: UpdateHouseholdDto) {
    const household = await this.findByUserId(userId);
    if (!household) throw new NotFoundException('Household not found');

    return this.prisma.household.update({
      where: { id: household.id },
      data,
    });
  }

  async remove(userId: string) {
    const household = await this.findByUserId(userId);
    if (!household) throw new NotFoundException('Household not found');

    await this.prisma.household.delete({ where: { id: household.id } });

    return { message: 'Household successfully deleted' };
  }
}
