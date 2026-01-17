import { Module } from '@nestjs/common';
import { PracticeAreasController } from './practice-areas.controller';
import { PracticeAreasService } from './practice-areas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PracticeAreasController],
  providers: [PracticeAreasService]
})
export class PracticeAreasModule {}
