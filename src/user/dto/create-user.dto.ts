import {
  IsString,
  IsEmail,
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
  id: string;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

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
