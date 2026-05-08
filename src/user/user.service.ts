import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private async findUserOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(id: string, email: string, data: CreateUserDto) {
    const household = await this.prisma.household.create({ data: {} });
    const workplace = await this.prisma.workplace.create({ data: {} });

    return this.prisma.user.create({
      data: {
        ...data,
        id,
        email,
        role: data.role ?? Role.USER,
        householdId: household.id,
        workplaceId: workplace.id,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.findUserOrThrow(id);
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findUserOrThrow(id);

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateRole(userId: string, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async uploadUserAvatar(
    userId: string,
    userRole: string,
    fileBuffer: Buffer,
    mimetype: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const fileName = `user-${userId}.webp`;
    const avatarUrl = await this.storageService.uploadFile(
      fileBuffer,
      fileName,
      'avatars',
      mimetype,
      userId,
      userRole,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return { message: 'Avatar updated successfully', avatarUrl };
  }

  async delete(id: string) {
    await this.findUserOrThrow(id);
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User successfully deleted' };
  }
}
