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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';

@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getRooms(@Req() req: UserRequest) {
    return this.roomService.findByHousehold(req.user);
  }

  @Get(':id')
  async getRoomById(@Req() req: UserRequest, @Param('id') roomId: string) {
    return this.roomService.findOneById(req.user, roomId);
  }

  @Post()
  async createRoom(@Req() req: UserRequest, @Body() data: CreateRoomDto) {
    return this.roomService.create(req.user, data);
  }

  @Patch(':id')
  async updateRoom(
    @Req() req: UserRequest,
    @Param('id') roomId: string,
    @Body() data: UpdateRoomDto,
  ) {
    return this.roomService.update(req.user, roomId, data);
  }

  @Delete(':id')
  async deleteRoom(@Req() req: UserRequest, @Param('id') roomId: string) {
    return this.roomService.remove(req.user, roomId);
  }
}
