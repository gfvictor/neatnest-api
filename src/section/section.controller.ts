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
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRequest } from '../common/interfaces/user-request';

@Controller('section')
@UseGuards(JwtAuthGuard)
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getSections(@Req() req: UserRequest) {
    return this.sectionService.findByWorkplace(req.user);
  }

  @Get(':id')
  async getSectionById(
    @Req() req: UserRequest,
    @Param('id') sectionId: string,
  ) {
    return this.sectionService.findOneById(req.user, sectionId);
  }

  @Post()
  async createSection(@Req() req: UserRequest, @Body() data: CreateSectionDto) {
    return this.sectionService.create(req.user, data);
  }

  @Patch(':id')
  async updateSection(
    @Req() req: UserRequest,
    @Param('id') sectionId: string,
    @Body() data: UpdateSectionDto,
  ) {
    return this.sectionService.update(req.user, sectionId, data);
  }

  @Delete(':id')
  async deleteSection(@Req() req: UserRequest, @Param('id') sectionId: string) {
    return this.sectionService.remove(req.user, sectionId);
  }
}
