
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type ProjectResourcesDocument = ProjectResource & Document;

@Schema({timestamps: true, collection: 'tl_project_resources'})
export class ProjectResource {



@Prop({required: true})
project_id : string;

 @Prop({required:  true})
 project_name : string;

 @Prop({required: true})
 user_id : string;

 @Prop({required: true})
 user_name: string;
}

export const ProjectResourceSchema = SchemaFactory.createForClass(ProjectResource)





 

 