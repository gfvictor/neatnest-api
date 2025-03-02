import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findByHousehold(user: User) {
    if (!user.householdId)
      throw new NotFoundException('Household not found for this user');

    return this.prisma.room.findMany({
      where: { householdId: user.householdId },
    });
  }

  async findOneById(user: User, roomId: string) {
    if (!user.householdId) throw new NotFoundException('Household not found for this user');

    const room = await this.prisma.room.findUnique({
      where: { id: roomId, householdId: user.householdId },
    });

    if (!room) throw new NotFoundException('Room not found in this household');

    return room;
  }

  async create(user: User, data: CreateRoomDto) {
    if (!user.householdId) throw new NotFoundException('Household not found for this user');

    return this.prisma.room.create({
      data: {
        name: data.name,
        householdId: user.householdId,
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

    return { messgae: 'Room successfully deleted' };
  }
}
