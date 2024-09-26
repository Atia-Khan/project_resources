import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios'; 
import { Model , Types} from 'mongoose';
import { ProjectResource, ProjectResourcesDocument } from '../project_resources/entities/project_resource.entity';
import { lastValueFrom } from 'rxjs'; 

@Injectable()
export class ProjectResourcesService {
  constructor(
    @InjectModel(ProjectResource.name) private readonly projectResourceModel: Model<ProjectResourcesDocument>,
    private readonly httpService: HttpService
  ) {}

  
  async create(ProjectResource: Partial<ProjectResource>): Promise<ProjectResource> {
    const newResource = new this.projectResourceModel(ProjectResource);
    return newResource.save();
  }


  async findAll(): Promise<ProjectResource[]> {
    return this.projectResourceModel.find().exec();
  }

 
  async findOne(id: string): Promise<ProjectResource> {
    const projectResource = await this.projectResourceModel.findById(id).exec();
    if(!projectResource){
      throw new NotFoundException(`Project Resource with ID ${id} not found`);
    }
    return projectResource;
  }

  async findByProjectId(projectId: string): Promise<ProjectResource[]> {
    return this.projectResourceModel.find({ project_id: projectId }).exec();
  }

  async countResourcesByProjectId(projectId: string): Promise<number> {
    return this.projectResourceModel.countDocuments({ project_id: projectId }).exec();
  }


  async findResourcesWithUsersDetails(projectId: string): Promise<any[]> {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    
    const projectResources = await this.projectResourceModel.find({ project_id: projectId }).exec();

    if (!projectResources || projectResources.length === 0) {
      throw new NotFoundException(`No resources found for project with ID ${projectId}`);
    }
    const resourcesWithUserDetails = await Promise.all(
      projectResources.map(async (resource) => {
        const user = await this.getUserDetails(resource.user_id);
        return {
          ...resource.toObject(),  
          user,  
        };
      })
    );

    return resourcesWithUserDetails;
  }


async getUserDetails(userId: string): Promise<any> {
    const url = `${process.env.AUTH_SERVICE_URL}/users/${userId}`; 
    console.log(url);

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      // console.log(response.data)
      return response.data;  
      
      
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
}



  async update(id: string, updateProjectResourceDto: Partial<ProjectResource>): Promise<ProjectResource> {
    const updatedResource = await this.projectResourceModel.findByIdAndUpdate(id, updateProjectResourceDto, { new: true }).exec();
  
    if (!updatedResource) {
      throw new Error(`ProjectResource with ID ${id} not found.`);
    }
  
    return updatedResource;
  }

  async delete(id: string): Promise<void> {
    const result = await this.projectResourceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Project Resource with ID ${id} not found`);
    }
  }



  async countUniqueUsersForAllProjects(): Promise<{ projectId: string; resourceCount: number }[]> {
    
    const results = await this.projectResourceModel.aggregate([
        {
            $group: {
                _id: "$project_id", 
                resourceCount: { $addToSet: "$user_id" } 
            }
        },
        {
            $project: {
                // projectId: "$_id", // Rename _id to projectId
                resourceCount: { $size: "$resourceCount" } // Count unique user_ids
            }
        }
    ]).exec();

    return results; 
}


}
