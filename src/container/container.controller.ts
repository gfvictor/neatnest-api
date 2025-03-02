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
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';

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
