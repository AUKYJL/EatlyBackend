import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsEmail()
  email: string;

  phone: string;

  @MinLength(6, { message: 'Password must be at least 6 symbols' })
  password: string;
}
