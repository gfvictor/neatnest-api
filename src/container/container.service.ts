import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { validateContainerAccess } from '../common/utils/validate-container-access';
import { User } from '@prisma/client';
import { ListContainersDto } from './dto/list-containers.dto';

@Injectable()
export class ContainerService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async findWithFilters(user: User, { roomId, sectionId }: ListContainersDto) {
    if (!user.householdId && !user.workplaceId) {
      throw new ForbiddenException(
        'User does not belong to a household or workplace',
      );
    }

    if (roomId || sectionId) {
      return this.prisma.container.findMany({
        where: {
          ...(roomId ? { roomId } : {}),
          ...(sectionId ? { sectionId } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const whereOr: {
      room?: { householdId: string };
      section?: { workplaceId: string };
    }[] = [];
    if (user.householdId)
      whereOr.push({ room: { householdId: user.householdId } });
    if (user.workplaceId)
      whereOr.push({ section: { workplaceId: user.workplaceId } });

    return this.prisma.container.findMany({ where: { OR: whereOr } });
  }

  async findOneById(user: User, containerId: string) {
    await validateContainerAccess(this.prisma, user, containerId);

    const container = await this.prisma.container.findUnique({
      where: { id: containerId },
      include: {
        objects: true,
        room: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
      },
    });

    if (!container) {
      throw new BadRequestException('Container not found');
    }

    return {
      ...container,
      roomId: container.room?.id || null,
      sectionId: container.section?.id || null,
    };
  }

  async create(user: User, data: CreateContainerDto) {
    if (data.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: data.roomId },
        select: { householdId: true },
      });

      if (!room) {
        throw new BadRequestException('Room not found');
      }

      const userRecord = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { householdId: true },
      });

      if (room.householdId !== userRecord?.householdId)
        throw new ForbiddenException('User does not belong to this household');
    }

    if (data.sectionId) {
      const section = await this.prisma.section.findUnique({
        where: { id: data.sectionId },
        select: { workplaceId: true },
      });

      if (!section) {
        throw new BadRequestException('Section not found');
      }

      const userRecord = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { workplaceId: true },
      });

      if (section.workplaceId !== userRecord?.workplaceId) {
        throw new ForbiddenException('User does not belong to this workplace');
      }
    }

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

  async uploadContainerImage(
    user: User,
    containerId: string,
    fileBuffer: Buffer,
    mimetype: string,
  ) {
    await this.findOneById(user, containerId);

    const filePath = `containers/${containerId}-${Date.now()}.webp`;
    const imageUrl = await this.storageService.uploadFile(
      fileBuffer,
      filePath,
      'containers',
      mimetype,
    );

    return this.prisma.container.update({
      where: { id: containerId },
      data: { image: imageUrl },
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
