import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePersonDto, UpdatePersonDto } from './person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() data: CreatePersonDto) {
    return this.personService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() data: UpdatePersonDto) {
    return this.personService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.personService.delete(id);
  }
}
