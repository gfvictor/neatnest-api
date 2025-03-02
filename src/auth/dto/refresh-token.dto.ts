import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'The user ID is mandatory' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'The refresh token is mandatory' })
  refreshToken: string;
}
