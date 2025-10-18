import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: {
    id: string;
    email: string;
    username: string;
    role: string;
    householdId?: string | null;
    workplaceId?: string | null;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      householdId: user.householdId,
      workplaceId: user.workplaceId,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    req: Request,
  ) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const device = req.headers['user-agent'] || 'Unknown Device';
    const ip = req.ip || 'Unknown IP';

    await this.prisma.session.create({
      data: {
        user: { connect: { id: userId } },
        refreshToken: hashedRefreshToken,
        device,
        ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });
  }

  async getUserSessions(userId: string, userRole: Role) {
    if (userRole === Role.ADMIN) {
      return this.prisma.session.findMany({
        select: {
          id: true,
          user: {
            select: { id: true, username: true, email: true, role: true },
          },
          device: true,
          ip: true,
          createdAt: true,
          expiresAt: true,
        },
      });
    }

    return this.prisma.session.findMany({
      where: { userId },
      select: {
        id: true,
        device: true,
        ip: true,
        createdAt: true,
        expiresAt: true,
      },
    });
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async login(identifier: string, password: string, req: Request) {
    const user = await this.validateUser(identifier, password);

    const { access_token, refresh_token } = this.generateToken(user);
    await this.createSession(user.id, refresh_token, req);

    return { access_token, refresh_token };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const session = await this.prisma.session.findFirst({
      where: { userId, refreshToken: { not: undefined } },
      include: { user: true },
    });
    if (!session || !session.refreshToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const isValid = await bcrypt.compare(refreshToken, session.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { access_token, refresh_token: newRefreshToken } = this.generateToken(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        householdId: user.householdId,
        workplaceId: user.workplaceId,
      },
    );

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: await bcrypt.hash(newRefreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { access_token, refresh_token: newRefreshToken };
  }

  async logout(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session no found');
    }

    await this.prisma.session.delete({ where: { id: sessionId } });

    return { message: 'User successfully logged out' };
  }

  async logoutAll(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });

    return { message: 'All sessions successfully logged out' };
  }
}
