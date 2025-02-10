import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    username: string;
    password: string;
    homeUse: boolean;
    workUse: boolean;
    isAdmin: boolean;
  }) {
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
    return this.prisma.person.findUnique({ where: { id } });
  }
}
