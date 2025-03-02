import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { HouseholdService } from './household.service';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('household')
@UseGuards(JwtAuthGuard)
export class HouseholdController {
  constructor(private readonly householdService: HouseholdService) {}

  @Get()
  async getUserHousehold(@Req() req: AuthenticatedRequest) {
    return this.householdService.findByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async getHouseholdById(@Param('id') id: string) {
    return this.householdService.findOneById(id);
  }

  @Patch()
  async updateHousehold(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateHouseholdDto,
  ) {
    return this.householdService.update(req.user.id, data);
  }

  @Delete()
  @Roles('ADMIN')
  async deleteHousehold(@Req() req: AuthenticatedRequest) {
    return this.householdService.remove(req.user.id);
  }
}
