import { Controller, Query, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProjectResourcesService } from './project_resources.service';
import { ProjectResource } from '../project_resources/entities/project_resource.entity';



@Controller('project-resources')
export class ProjectResourcesController {
  constructor(private readonly projectResourcesService: ProjectResourcesService) {}

  @Post()
  async create(@Body() ProjectResource: Partial<ProjectResource>): Promise<ProjectResource> {
    return this.projectResourcesService.create(ProjectResource);
  }

  // @Get()
  // async findAll(): Promise<ProjectResource[]> {
  //   return this.projectResourcesService.findAll();
  // }

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

  @Get('count/:projectId')
  async countResources(@Param('projectId') projectId: string): Promise<{ resourceCount: number }> {
    const resourceCount = await this.projectResourcesService.countResourcesByProjectId(projectId);

    return { resourceCount };
  }


  @Get()
  async findAll(@Query('projectId') projectId?: string): Promise<ProjectResource[]> {
    let projectResources: ProjectResource[];

    if (projectId) {
      
      projectResources = await this.projectResourcesService.findByProjectId(projectId);
    } else {
      
      projectResources = await this.projectResourcesService.findAll();
    }

    if (!projectResources || projectResources.length === 0) {
      throw new NotFoundException('No project resources found');
    }

    return projectResources;
  }


  // @Get()
  // async findAll(@Query('userId') userId?: string): Promise<ProjectResource[]> {
  //   let projectResources: ProjectResource[];

  //   if (userId) {
      
  //     projectResources = await this.projectResourcesService.findResourcesByUserId(userId);
  //   } else {
      
  //     projectResources = await this.projectResourcesService.findAll();
  //   }

  //   if (!projectResources || projectResources.length === 0) {
  //     throw new NotFoundException('No project resources found');
  //   }

  //   return projectResources;
  // }


  @Get('resources-with-user/:projectId')
  async getResourcesWithUsersDetails(@Param('projectId') projectId: string): Promise<any[]> {
      return await this.projectResourcesService.findResourcesWithUsersDetails(projectId);
  }
  



  @Get('resources-with-user/:projectId')
  async getResourcesWithUserDetails(@Param('projectId') projectId: string): Promise<any> {
    
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

   
    const projectResources = await this.projectResourcesService.getUserDetails(projectId);

    if (!projectResources || projectResources.length === 0) {
      throw new NotFoundException(`No resources found for project with ID ${projectId}`);
    }

   
    const resourcesWithUserDetails = await Promise.all(
      projectResources.map(async (resource) => {
        const userDetails = await this.projectResourcesService.getUserDetails(resource.user_id);
        return {
          ...resource, 
          userDetails,            
        };
      }),
    );

    return resourcesWithUserDetails;
  }

}
