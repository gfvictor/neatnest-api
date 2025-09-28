import { IsOptional, IsUUID } from 'class-validator';

export class ListContainersDto {
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @IsOptional()
  @IsUUID('4')
  sectionId?: string;
}
