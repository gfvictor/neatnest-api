import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'The identifier (username or email) is mandatory' })
  identifier: string;

  @IsString()
  @MinLength(6, { message: 'The password need to have at least 6 characters' })
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'The user ID is mandatory' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'The refresh token is mandatory' })
  refreshToken: string;
}
