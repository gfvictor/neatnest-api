import { IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  name: string;
}
