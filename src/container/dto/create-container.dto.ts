import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateContainerDto {
  @IsString()
  name: string;

  @IsInt()
  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  sectionId?: string;
}
