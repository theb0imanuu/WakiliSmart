import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { PracticeAreasService } from './practice-areas.service';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('practice-areas')
export class PracticeAreasController {
  constructor(private readonly practiceAreasService: PracticeAreasService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPracticeAreaDto: CreatePracticeAreaDto, @Request() req: any) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can create practice areas');
    }
    return this.practiceAreasService.create(createPracticeAreaDto);
  }

  @Get()
  findAll() {
    return this.practiceAreasService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.practiceAreasService.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePracticeAreaDto: UpdatePracticeAreaDto,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can update practice areas');
    }
    return this.practiceAreasService.update(id, updatePracticeAreaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can delete practice areas');
    }
    return this.practiceAreasService.remove(id);
  }
}
