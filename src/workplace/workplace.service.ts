import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkplaceService {
  constructor(private prisma: PrismaService) {}

  async createForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { workplaceId: true },
    });

    if (user?.workplaceId)
      throw new BadRequestException('User already has a workplace');

    const workplace = await this.prisma.workplace.create({ data: {} });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        workplaceId: workplace.id,
        workUse: true,
      },
    });
  }

  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { workplaceId: true },
    });

    if (!user?.workplaceId)
      throw new NotFoundException('Workplace not found for this user');

    return this.prisma.workplace.findUnique({
      where: { id: user.workplaceId },
    });
  }

  async update(userId: string, data: UpdateWorkplaceDto) {
    const workplace = await this.findByUserId(userId);

    return this.prisma.workplace.update({
      where: { id: workplace?.id },
      data,
    });
  }

  async remove(userId: string) {
    const workplace = await this.findByUserId(userId);

    await this.prisma.workplace.delete({ where: { id: workplace?.id } });

    return { message: 'Workplace successfully deleted' };
  }
}
