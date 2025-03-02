import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async findByWorkplace(user: User) {
    if (!user.workplaceId)
      throw new NotFoundException('Workplace not found for this user');

    return this.prisma.section.findMany({
      where: { workplaceId: user.workplaceId },
    });
  }

  async findOneById(user: User, sectionId: string) {
    if (!user.workplaceId)
      throw new NotFoundException('Workplace not found for this user');

    const section = await this.prisma.section.findUnique({
      where: { id: sectionId, workplaceId: user.workplaceId },
    });

    if (!section)
      throw new NotFoundException('Section not found in this workplace');

    return section;
  }

  async create(user: User, data: CreateSectionDto) {
    if (!user.workplaceId)
      throw new NotFoundException('Workplace not found for this user');

    return this.prisma.section.create({
      data: {
        name: data.name,
        workplaceId: user.workplaceId,
      },
    });
  }

  async update(user: User, sectionId: string, data: UpdateSectionDto) {
    await this.findOneById(user, sectionId);

    return this.prisma.section.update({
      where: { id: sectionId },
      data,
    });
  }

  async remove(user: User, sectionId: string) {
    await this.findOneById(user, sectionId);
    await this.prisma.section.delete({ where: { id: sectionId } });

    return { message: 'Section successfully deleted' };
  }
}
