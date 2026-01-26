import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('cases')
@UseGuards(AuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  findAll(@Query('q') query: string) {
    return this.casesService.findAll(query);
  }

  @Get(':id')
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto) {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'ADVOCATE')
  remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
