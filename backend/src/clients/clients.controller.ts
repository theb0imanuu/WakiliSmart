import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Post()
  async create(@Body() createClientDto: any) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: any) {
    return this.clientsService.update(id, updateClientDto);
  }
}
