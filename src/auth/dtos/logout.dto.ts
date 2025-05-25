import { IsNotEmpty } from 'class-validator';

export class LogoutDTO {
  @IsNotEmpty()
  token: string;
}
