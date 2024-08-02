import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: { email: string; password: string }) {
    return this.authService.signup(signupDto.email, signupDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify-token')
  async verifyToken(@Request() req) {
    return req.user;
  }
}
