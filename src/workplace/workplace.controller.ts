import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { UpdateWorkplaceDto } from './dto/update-workplace.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';

@Controller('workplace')
@UseGuards(JwtAuthGuard)
export class WorkplaceController {
  constructor(private readonly workplaceService: WorkplaceService) {}

  @Post('create')
  async createWorkplace(@Req() req: UserRequest) {
    return this.workplaceService.createForUser(req.user.id);
  }

  @Get()
  async getWorkplace(@Req() req: UserRequest) {
    return this.workplaceService.findByUserId(req.user.id);
  }

  @Patch()
  async updateWorkplace(
    @Req() req: UserRequest,
    @Body() data: UpdateWorkplaceDto,
  ) {
    return this.workplaceService.update(req.user.id, data);
  }

  @Delete()
  async deleteWorkplace(@Req() req: UserRequest) {
    return this.workplaceService.remove(req.user.id);
  }
}
