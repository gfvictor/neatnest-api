import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async findUserOrThrow(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const household = await this.prisma.household.create({
      data: {},
    });

    const workplace = data.workUse
      ? await this.prisma.workplace.create({ data: {} })
      : null;

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role ?? Role.USER,
        householdId: household.id,
        workplaceId: workplace?.id ?? null,
      },
    });
  }

  async addWorkplace(userId: string) {
    const user = await this.findUserOrThrow(userId);

    if (user.workplaceId) {
      throw new BadRequestException('User already has workplace');
    }

    const workplace = await this.prisma.workplace.create({
      data: {},
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { workplaceId: workplace.id },
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

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

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

  async delete(id: string) {
    await this.findUserOrThrow(id);
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User successfully deleted' };
  }
}
