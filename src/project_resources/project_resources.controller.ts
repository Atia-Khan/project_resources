import { Controller, Query, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProjectResourcesService } from './project_resources.service';
import { ProjectResource } from '../project_resources/entities/project_resource.entity';



@Controller('project-resources')
export class ProjectResourcesController {
  constructor(private readonly projectResourcesService: ProjectResourcesService) {}



  @Get('count')
  async countUniqueUsersForAllProjects(): Promise<{ projectId: string; resourceCount: number }[]> {
    
      const resourceCounts = await this.projectResourcesService.countUniqueUsersForAllProjects();
      return resourceCounts;
  }

  @Post()
  async create(@Body() ProjectResource: Partial<ProjectResource>): Promise<ProjectResource> {
    const isAlreadyAssigned = await this.projectResourcesService.checkIfResourceAssigned(
      ProjectResource.project_id,
      ProjectResource.user_id
    );

    if(isAlreadyAssigned){
      throw new BadRequestException('This resource is already assigned to the project.');
    }
    return this.projectResourcesService.create(ProjectResource);
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




  // @Get('resources-with-user/:projectId')
  // async getResourcesWithUsersDetails(@Param('projectId') projectId: string): Promise<any[]> {
  //     return await this.projectResourcesService.findResourcesWithUsersDetails(projectId);
  // }
  



  @Get('resources-with-user/:projectId')
  async getResourcesWithUserDetails(@Param('projectId') projectId: string): Promise<any[]> {
    
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    const projectResources = await this.projectResourcesService.findByProjectId(projectId);

  if (!projectResources || projectResources.length === 0) {
    throw new NotFoundException(`No resources found for project with ID ${projectId}`);
  }
   
    // const projectResourcesUser = await this.projectResourcesService.getUserDetails(projectId);

    // if (!projectResources || projectResources.length === 0) {
    //   throw new NotFoundException(`No resources found for project with ID ${projectId}`);
    // }

   
    const resourcesWithUserDetails = await Promise.all(
      projectResources.map(async (resource) => {
        try{
          const user = await this.projectResourcesService.getUserDetails(resource.user_id);
          return {
            ...resource, 
            user,            
          };
        }catch(error){
          console.error(`Error fetching user details for user ID ${resource.user_id}:`, error.message);
        
          // Handle the case where user details are not found
          return {
            ...resource,
            user: null,
        }
      }
      }),
    );


    // const resourcesWithUserDetails = await Promise.all(
    //   projectResources.map(async (resource) => {
    //     try {
    //       const userDetails = await this.projectResourcesService.getUserDetails(resource.user_id);
    //       const resourceObj = resource.toObject ? resource.toObject() : resource;

    //       return {
    //         ...resourceObj,
    //         userDetails,
    //       };
    //     } catch (error) {
    //       // Handle the case where user details are not found
    //       return {
    //         ...resourceObj,
    //         userDetails: null,
    //       };
    //     }
    //   }),
    // );
    return resourcesWithUserDetails;
  }


  
}
