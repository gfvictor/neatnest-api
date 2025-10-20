import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { User } from '@prisma/client';
import { validateContainerAccess } from '../common/utils/validate-container-access';

@Injectable()
export class ObjectService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async findByContainer(user: User, containerId: string) {
    await validateContainerAccess(this.prisma, user, containerId);

    return this.prisma.object.findMany({
      where: { containerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(user: User, objectId: string) {
    const object = await this.prisma.object.findUnique({
      where: { id: objectId },
      include: { container: { include: { room: true, section: true } } },
    });

    if (!object) throw new NotFoundException('Object not found');

    await validateContainerAccess(this.prisma, user, object.containerId);

    return object;
  }

  async create(user: User, data: CreateObjectDto) {
    await validateContainerAccess(this.prisma, user, data.containerId);

    return this.prisma.object.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        image: data.image,
        containerId: data.containerId,
      },
    });
  }

  async uploadObjectImage(
    user: User,
    objectId: string,
    fileBuffer: Buffer,
    mimetype: string,
  ) {
    await this.findOneById(user, objectId);

    const filePath = `object/${objectId}-${Date.now()}.webp`;
    const imageUrl = await this.storageService.uploadFile(
      fileBuffer,
      filePath,
      'objects',
      mimetype,
    );

    return this.prisma.object.update({
      where: { id: objectId },
      data: { image: imageUrl },
    });
  }

  async update(user: User, objectId: string, data: UpdateObjectDto) {
    const object = await this.findOneById(user, objectId);

    return this.prisma.object.update({
      where: { id: object.id },
      data,
    });
  }

  async remove(user: User, objectId: string) {
    const object = await this.findOneById(user, objectId);

    await this.prisma.object.delete({ where: { id: object.id } });

    return { message: 'Object successfully deleted' };
  }
}
