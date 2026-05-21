import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateObjectDto } from "@neatnest/object/dto/create-object.dto";
import { UpdateObjectDto } from "@neatnest/object/dto/update-object.dto";
import { PrismaService } from "@neatnest/prisma/prisma.service";
import { StorageService } from "@neatnest/storage/storage.service";
import { User, Prisma } from "@prisma/client";
import { validateContainerAccess } from "@neatnest/common/utils/validate-container-access";

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
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneById(user: User, objectId: string) {
    const object = await this.prisma.object.findUnique({
      where: { id: objectId },
      include: { container: { include: { room: true, section: true } } },
    });

    if (!object) throw new NotFoundException("Object not found");

    await validateContainerAccess(this.prisma, user, object.containerId);

    return object;
  }

  async searchForGlobal(
    searchTerm: string,
    accessConditions: Prisma.ContainerWhereInput[],
  ) {
    if (!accessConditions || accessConditions.length === 0) {
      return [];
    }

    return this.prisma.object.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
        ],
        container: {
          OR: accessConditions,
        },
        deletedAt: null,
      },
      include: {
        container: {
          select: {
            id: true,
            name: true,
            roomId: true,
            sectionId: true,
            room: { select: { id: true, name: true } },
            section: { select: { id: true, name: true } },
          },
        },
      },
      take: 20,
    });
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
    userId: string,
    userRole: string,
  ) {
    const object = await this.findOneById(user, objectId);

    await this.storageService.deleteFileByUrl(object.image);

    const filePath = `object/${objectId}-${Date.now()}.webp`;
    const imageUrl = await this.storageService.uploadFile(
      fileBuffer,
      filePath,
      "objects",
      mimetype,
      userId,
      userRole,
    );

    return this.prisma.object.update({
      where: { id: objectId },
      data: { image: imageUrl },
    });
  }

  async update(user: User, objectId: string, data: UpdateObjectDto) {
    const object = await this.findOneById(user, objectId);

    if (data.image === null && object.image) {
      await this.storageService.deleteFileByUrl(object.image);
    }

    return this.prisma.object.update({
      where: { id: object.id },
      data,
    });
  }

  async remove(user: User, objectId: string) {
    const object = await this.findOneById(user, objectId);

    await this.prisma.object.delete({ where: { id: object.id } });

    await this.storageService.deleteFileByUrl(object.image);

    return { message: "Object successfully deleted" };
  }
}
