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

@Injectable()
export class ContainerService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

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
    await validateContainerAccess(this.prisma, user, containerId);
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
