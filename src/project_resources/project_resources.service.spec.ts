import { Test, TestingModule } from '@nestjs/testing';
import { ProjectResourcesService } from './project_resources.service';

describe('ProjectResourcesService', () => {
  let service: ProjectResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectResourcesService],
    }).compile();

    service = module.get<ProjectResourcesService>(ProjectResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
