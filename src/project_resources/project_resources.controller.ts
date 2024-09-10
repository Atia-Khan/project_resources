import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectResourcesService } from './project_resources.service';
import { ProjectResource } from '../project_resources/entities/project_resource.entity';



@Controller('project-resources')
export class ProjectResourcesController {
  constructor(private readonly projectResourcesService: ProjectResourcesService) {}

  @Post('/add')
  async create(@Body() ProjectResource: Partial<ProjectResource>): Promise<ProjectResource> {
    return this.projectResourcesService.create(ProjectResource);
  }

  @Get('/get')
  async findAll(): Promise<ProjectResource[]> {
    return this.projectResourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResource> {
    return this.projectResourcesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProjectResourceDto: Partial<ProjectResource>): Promise<ProjectResource> {
    return this.projectResourcesService.update(id, updateProjectResourceDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.projectResourcesService.delete(id);
  }
}
