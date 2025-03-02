import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() data: LoginDto, @Req() req: Request) {
    return this.authService.login(data.identifier, data.password, req);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getUserSessions(@Req() req: AuthenticatedRequest) {
    return this.authService.getUserSessions(req.user.id, req.user.role);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data.userId, data.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { sessionId: string }) {
    return this.authService.logout(body.sessionId);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(@Req() req: AuthenticatedRequest) {
    return this.authService.logoutAll(req.user.id);
  }
}
