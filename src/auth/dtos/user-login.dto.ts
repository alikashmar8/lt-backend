import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;
}
