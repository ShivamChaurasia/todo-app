import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user-dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    // Find user by email
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Return user details excluding password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    // Validate user credentials
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Generate access and refresh tokens
    const accessToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '30d' },
    );

    // Save refresh token to user
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.create(email, hashedPassword);

    // Generate JWT token for the newly created user
    return this.login(email, password);
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userService.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const payload: JwtPayload = { email: user.email };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // Update tokens in the database
    await this.userService.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: number) {
    // Clear refresh token for the user
    await this.userService.clearRefreshToken(userId);
  }
}
