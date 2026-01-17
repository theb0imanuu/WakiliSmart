import { Test, TestingModule } from '@nestjs/testing';
import { PracticeAreasService } from './practice-areas.service';

describe('PracticeAreasService', () => {
  let service: PracticeAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PracticeAreasService],
    }).compile();

    service = module.get<PracticeAreasService>(PracticeAreasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
