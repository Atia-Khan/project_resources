import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectResource, ProjectResourcesDocument } from '../project_resources/entities/project_resource.entity';
import { UpdateProjectResourceDto } from './dto/update-project_resource.dto';

@Injectable()
export class ProjectResourcesService {
  constructor(
    @InjectModel(ProjectResource.name) private readonly projectResourceModel: Model<ProjectResourcesDocument>,
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
}
