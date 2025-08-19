import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  private async getHouseholdOrThrow(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { householdId: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.householdId)
      throw new NotFoundException('Household not found for this user');
    return user.householdId;
  }

  async findByHousehold(user: User) {
    const householdId = await this.getHouseholdOrThrow(user.id);

    return this.prisma.room.findMany({
      where: { householdId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(user: User, roomId: string) {
    const householdId = await this.getHouseholdOrThrow(user.id);

    const room = await this.prisma.room.findFirst({
      where: { id: roomId, householdId },
    });

    if (!room) throw new NotFoundException('Room not found in this household');

    return room;
  }

  async create(user: User, data: CreateRoomDto) {
    const householdId = await this.getHouseholdOrThrow(user.id);

    return this.prisma.room.create({
      data: {
        name: data.name,
        householdId,
      },
    });
  }

  async update(user: User, roomId: string, data: UpdateRoomDto) {
    await this.findOneById(user, roomId);

    return this.prisma.room.update({
      where: { id: roomId },
      data,
    });
  }

  async remove(user: User, roomId: string) {
    await this.findOneById(user, roomId);
    await this.prisma.room.delete({ where: { id: roomId } });

    return { message: 'Room successfully deleted' };
  }
}
