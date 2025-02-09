import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PersonService } from './person.service';

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
  async findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }
}
