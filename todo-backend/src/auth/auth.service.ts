import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDto | null> {
    // Find user by email
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
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
  ): Promise<{ access_token: string } | null> {
    // Validate user credentials
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token if user is valid
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
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
}
