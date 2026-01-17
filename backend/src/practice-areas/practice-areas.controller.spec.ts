import { Test, TestingModule } from '@nestjs/testing';
import { PracticeAreasController } from './practice-areas.controller';

describe('PracticeAreasController', () => {
  let controller: PracticeAreasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeAreasController],
    }).compile();

    controller = module.get<PracticeAreasController>(PracticeAreasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
