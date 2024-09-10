import { Module } from '@nestjs/common';
import { ProjectResourcesService } from './project_resources.service';
import { ProjectResourcesController } from './project_resources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectResource, ProjectResourceSchema } from './entities/project_resource.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{name: ProjectResource.name, schema: ProjectResourceSchema}])
  ],
  controllers: [ProjectResourcesController],
  providers: [ProjectResourcesService],
})
export class ProjectResourcesModule {}
