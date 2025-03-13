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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('container')
@UseGuards(JwtAuthGuard)
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  async getContainers(@Req() req: UserRequest) {
    return this.containerService.findByLocation(req.user);
  }

  @Get(':id')
  async getContainerById(
    @Req() req: UserRequest,
    @Param('id') containerId: string,
  ) {
    return this.containerService.findOneById(req.user, containerId);
  }

  @Post()
  async createContainer(
    @Req() req: UserRequest,
    @Body() data: CreateContainerDto,
  ) {
    return this.containerService.create(req.user, data);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContainerImage(
    @Req() req: UserRequest,
    @Param('id') containerId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer || !file.mimetype)
      throw new BadRequestException('Invalid file provided');

    return this.containerService.uploadContainerImage(
      req.user,
      containerId,
      file.buffer,
      file.mimetype,
    );
  }

  @Patch(':id')
  async updateContainer(
    @Req() req: UserRequest,
    @Param('id') containerId: string,
    @Body() data: UpdateContainerDto,
  ) {
    return this.containerService.update(req.user, containerId, data);
  }

  @Delete(':id')
  async remove(@Req() req: UserRequest, @Param('id') containerId: string) {
    return this.containerService.remove(req.user, containerId);
  }
}
