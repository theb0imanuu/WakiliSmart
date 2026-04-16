import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  async findAll() {
    return this.casesService.findAll();
  }

  @Post()
  async create(@Body() createCaseDto: any, @Request() req: any) {
    return this.casesService.create({
      ...createCaseDto,
      createdById: req.user.id,
      clientId: Number(createCaseDto.clientId),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCaseDto: any) {
    return this.casesService.update(id, updateCaseDto);
  }
}
