import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from './dtos/user-login.dto';
import { AdminLoginDTO } from './dtos/admin-login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(@Body() body: UserLoginDTO) {
  //   return await this.authService.userLogin(body);
  // }

  @Post('login/admin')
  async adminLogin(@Body() body: AdminLoginDTO) {
    return await this.authService.adminLogin(body);
  }

  // @Post('refresh-token')
  // async refreshToken(@Body() body: { refreshToken: string }) {
  //   return await this.authService.refreshToken(body.refreshToken);
  // }

  // @Post('admin/refresh-token')
  // async adminRefreshToken(@Body() body: { refreshToken: string }) {
  //   return await this.authService.adminRefreshToken(body.refreshToken);
  // }

  // @Post('logout')
  // async logout(@Body() body: LogoutDTO) {
  //   return await this.authService.logout(body.refreshToken);
  // }

  // @Post('register')
  // async register(@Body() body: RegisterUserDTO) {
  //   return await this.authService.register(body);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Get('sendEmailVerificationCode')
  // async sendEmailVerificationCode(@CurrentUser() user: User) {
  //   return await this.authService.sendEmailVerificationCode(user.id);
  // }

  // @UseGuards(IsUserGuard)
  // @ApiBearerAuth('access_token')
  // @Post('verifyEmailNumber')
  // async checkValidEmailCode(
  //   @CurrentUser() user: User,
  //   @Body('code') code: string,
  // ) {
  //   return await this.authService.verifyEmail(user.id, code);
  // }

  // @Post('forgetPassword')
  // async forgotPassword(
  //   @Body() data: ForgetPasswordDTO,
  // ): Promise<{ success: boolean }> {
  //   return await this.authService.forgetPasswordByEmail(data.email);
  // }

  // @Post('passwordReset')
  // async validatePasswordResetCode(@Body() data: PasswordResetDTO) {
  //   return await this.authService.passwordReset(data);
  // }
}
