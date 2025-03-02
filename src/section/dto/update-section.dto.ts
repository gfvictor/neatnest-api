import { IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  name?: string;
}
