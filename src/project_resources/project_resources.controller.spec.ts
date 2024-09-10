import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResourcesController } from './project_resources.controller';
import { ProjectResourcesService } from './project_resources.service';

describe('ProjectResourcesController', () => {
  let controller: ProjectResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectResourcesController],
      providers: [ProjectResourcesService],
    }).compile();

    controller = module.get<ProjectResourcesController>(ProjectResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
