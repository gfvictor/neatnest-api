import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { PersonService } from './person.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('Person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  async create(
    @Body()
    data: {
      name: string;
      email: string;
      username: string;
      password: string;
      homeUse: boolean;
      workUse: boolean;
      isAdmin: boolean;
    },
  ) {
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
}
