import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

export async function validateContainerAccess(
  prisma: PrismaService,
  user: User,
  containerId: string,
) {
  const container = await prisma.container.findUnique({
    where: { id: containerId },
    include: { room: true, section: true },
  });

  if (!container) throw new NotFoundException('Container not found');

  const belongToUser =
    (container.room?.householdId &&
      container.room.householdId === user.householdId) ||
    (container.section?.workplaceId &&
      container.section.workplaceId === user.workplaceId);

  if (!belongToUser)
    throw new ForbiddenException('You do not have access to this container');

  return container;
}
