import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'The identifier (username or email) is mandatory' })
  identifier: string;

  @IsString()
  @MinLength(6, { message: 'The password need to have at least 6 characters' })
  password: string;
}
