import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { Express } from 'express';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.userService.findOne(req.user.id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer || !file.mimetype) {
      throw new BadRequestException('Invalid file provided');
    }

    return this.userService.uploadUserAvatar(
      req.user.id,
      req.user.role,
      file.buffer,
      file.mimetype,
    );
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUserRole(
    @Param('id') userId: string,
    @Body() body: { role: Role },
    @Req() req: AuthenticatedRequest,
  ) {
    if (req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles.');
    }

    return this.userService.updateRole(userId, body.role);
  }

  @Patch(':id/workplace')
  @UseGuards(JwtAuthGuard)
  async addWorkplace(@Param('id') userId: string) {
    return this.userService.addWorkplace(userId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
