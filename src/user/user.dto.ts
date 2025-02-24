import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export class CreateUserDto {
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

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

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
