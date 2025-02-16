import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  private async findUserOrThrow(id: string) {
    const user = await this.prisma.person.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: CreatePersonDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.person.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.person.findMany();
  }

  async findOne(id: string) {
    return this.findUserOrThrow(id);
  }

  async update(id: string, data: UpdatePersonDto) {
    await this.findUserOrThrow(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.person.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findUserOrThrow(id);
    await this.prisma.person.delete({ where: { id } });

    return { message: 'User successfully deleted' };
  }
}
