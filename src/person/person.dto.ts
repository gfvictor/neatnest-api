import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'The password must have at least 6 characters' })
  password: string;

  @IsBoolean()
  @IsOptional()
  homeUse?: boolean;

  @IsBoolean()
  @IsOptional()
  workUse?: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}

export class UpdatePersonDto {
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

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
