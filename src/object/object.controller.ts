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
} from '@nestjs/common';
import { ObjectService } from './object.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';

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

  @Delete(':id')
  async removeObject(@Req() req: UserRequest, @Param('id') objectId: string) {
    return this.objectService.remove(req.user, objectId);
  }
}
