import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ContainerService {
  constructor(private prisma: PrismaService) {}

  async findByLocation(user: User) {
    if (!user.householdId && !user.workplaceId)
      throw new ForbiddenException(
        'User does not belong to a household or workplace',
      );

    const filters: {
      room?: { householdId: string };
      section?: { workplaceId: string };
    }[] = [];

    if (user.householdId) {
      filters.push({ room: { householdId: user.householdId } });
    }
    if (user.workplaceId) {
      filters.push({ section: { workplaceId: user.workplaceId } });
    }

    return this.prisma.container.findMany({
      where: { OR: filters },
    });
  }

  async findOneById(user: User, containerId: string) {
    const container = await this.prisma.container.findUnique({
      where: { id: containerId },
      include: { room: true, section: true },
    });

    if (!container) throw new NotFoundException('Container not found');

    const belongsToUser =
      (container.room?.householdId &&
        container.room.householdId === user.householdId) ||
      (container.section?.workplaceId &&
        container.section.workplaceId === user.workplaceId);

    if (!belongsToUser)
      throw new ForbiddenException('You do not have access to this container');

    return container;
  }

  async create(user: User, data: CreateContainerDto) {
    if (!user.householdId && !user.workplaceId)
      throw new ForbiddenException(
        'User must belong to a household or workplace',
      );

    if (data.roomId && data.sectionId)
      throw new BadRequestException(
        'A container cannot belong to both a room and a section at the same time',
      );

    return this.prisma.container.create({
      data: {
        name: data.name,
        number: data.number,
        image: data.image,
        roomId: data.roomId ?? null,
        sectionId: data.sectionId ?? null,
      },
    });
  }

  async update(user: User, containerId: string, data: UpdateContainerDto) {
    await this.findOneById(user, containerId);

    return this.prisma.container.update({
      where: { id: containerId },
      data,
    });
  }

  async remove(user: User, containerId: string) {
    await this.findOneById(user, containerId);
    await this.prisma.container.delete({ where: { id: containerId } });

    return { message: 'Container successfully deleted' };
  }
}
