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
import { ObjectService } from './object.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('object')
@UseGuards(JwtAuthGuard)
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get('container/:containerId')
  async getObjectsByContainer(
    @Req() req: UserRequest,
    @Param('containerId') containerId: string,
  ) {
    return this.objectService.findByContainer(req.user, containerId);
  }

  @Get(':id')
  async getObjectById(@Req() req: UserRequest, @Param('id') objectId: string) {
    return this.objectService.findOneById(req.user, objectId);
  }

  @Post()
  async createObject(@Req() req: UserRequest, @Body() data: CreateObjectDto) {
    return this.objectService.create(req.user, data);
  }

  @Patch(':id')
  async updateObject(
    @Req() req: UserRequest,
    @Param('id') objectId: string,
    @Body() data: UpdateObjectDto,
  ) {
    return this.objectService.update(req.user, objectId, data);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadObjectImage(
    @Req() req: UserRequest,
    @Param('id') objectId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer || !file.mimetype)
      throw new BadRequestException('Invalid file provided');

    return this.objectService.uploadObjectImage(
      req.user,
      objectId,
      file.buffer,
      file.mimetype,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  async removeObject(@Req() req: UserRequest, @Param('id') objectId: string) {
    return this.objectService.remove(req.user, objectId);
  }
}
