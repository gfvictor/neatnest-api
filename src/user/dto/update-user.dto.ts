import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6, { message: 'The password must have at least 6 characters' })
  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  homeUse?: boolean;

  @IsBoolean()
  @IsOptional()
  workUse?: boolean;
}