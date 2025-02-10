import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.person.findFirst({
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

  private generateToken(user: { id: string; email: string; username: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.person.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);

    const { access_token, refresh_token } = this.generateToken(user);
    await this.storeRefreshToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.person.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { access_token, refresh_token: newRefreshToken } =
      this.generateToken(user);
    await this.storeRefreshToken(user.id, newRefreshToken);

    return { access_token, refresh_token: newRefreshToken };
  }

  async logout(userId: string) {
    await this.prisma.person.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'User successfully logged out' };
  }
}
