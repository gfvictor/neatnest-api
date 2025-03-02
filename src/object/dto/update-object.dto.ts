import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateObjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
