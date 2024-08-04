import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  LoginDto,
  SignupDto,
  LoginResponseDto,
  RefreshTokenDto,
  TokensResponseDto,
} from './auth.dto';
import { UserDto } from '../user/user-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    description: 'Credentials for logging in',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User information for registration',
    type: SignupDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto.email, signupDto.password);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access and refresh tokens using the refresh token',
  })
  @ApiBody({
    description: 'Refresh token to get new tokens',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'New access and refresh tokens',
    type: TokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  @ApiOperation({ summary: 'Verify the JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifyToken(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = req.user;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({ status: 200, description: 'Successful logout' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req) {
    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }
}
