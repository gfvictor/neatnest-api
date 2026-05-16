import { IsString, IsBoolean, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export class CreateUserDto {
  @IsString()
  name: string;

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
