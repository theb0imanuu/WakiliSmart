import { Controller, Get, Param } from '@nestjs/common';
import { PracticeAreasService } from './practice-areas.service';

@Controller('practice-areas')
export class PracticeAreasController {
  constructor(private readonly practiceAreasService: PracticeAreasService) {}

  @Get()
  findAll() {
    return this.practiceAreasService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.practiceAreasService.findOne(slug);
  }
}
