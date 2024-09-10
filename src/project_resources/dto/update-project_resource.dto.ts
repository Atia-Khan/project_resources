import { PartialType } from '@nestjs/mapped-types';
import { ProjectResource } from './project_resource.dto';

export class UpdateProjectResourceDto extends PartialType(
  ProjectResource,
) {}
