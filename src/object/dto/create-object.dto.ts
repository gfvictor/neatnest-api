import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateObjectDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  containerId: string;
}
