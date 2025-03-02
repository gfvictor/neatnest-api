import { IsOptional, IsString } from 'class-validator';

export class UpdateWorkplaceDto {
  @IsString()
  @IsOptional()
  name?: string;
}
