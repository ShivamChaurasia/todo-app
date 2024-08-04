import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppUser } from '../user/app-user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email, password: hashedPassword, id: 1 } as AppUser;

      mockUserService.findOneByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('accessToken');

      const result = await authService.login(email, password);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'accessToken',
      });
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 1 },
        { expiresIn: '1h' },
      );
    });

    it('should throw an UnauthorizedException for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      mockUserService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signup', () => {
    it('should successfully create a user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mock UserService
      mockUserService.findOneByEmail = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(
          () => ({ email, password: hashedPassword, id: 1 }) as AppUser,
        );
      mockUserService.create.mockResolvedValue(undefined);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      // Mock JwtService
      const accessToken = 'accessToken';
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await authService.signup(email, password);

      expect(result).toEqual({ accessToken, refreshToken: 'accessToken' });
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(mockUserService.create).toHaveBeenCalledWith(
        email,
        hashedPassword,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { userId: 1 },
        { expiresIn: '1h' },
      );
    });

    it('should throw a ConflictException if the user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockUserService.findOneByEmail.mockResolvedValue({} as AppUser);

      await expect(authService.signup(email, password)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens', async () => {
      const refreshToken = 'valid-refresh-token';
      const user = { id: 1, email: 'test@example.com' };
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      userService.findByRefreshToken = jest.fn().mockResolvedValue(user);
      jwtService.sign = jest
        .fn()
        .mockImplementationOnce(() => newAccessToken) // For accessToken
        .mockImplementationOnce(() => newRefreshToken); // For refreshToken
      userService.updateRefreshToken = jest.fn().mockResolvedValue(undefined);

      const result = await authService.refreshToken(refreshToken);

      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      expect(userService.findByRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: user.email },
        { expiresIn: '30d' },
      );
      expect(userService.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        newRefreshToken,
      );
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      userService.findByRefreshToken = jest.fn().mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token'),
      );
      expect(userService.findByRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('logout', () => {
    it('should clear the refresh token for the user', async () => {
      const userId = 1;

      // Mocking the clearRefreshToken method
      userService.clearRefreshToken = jest.fn().mockResolvedValue(undefined);

      // Call the logout method
      await authService.logout(userId);

      // Assert clearRefreshToken was called with the correct userId
      expect(userService.clearRefreshToken).toHaveBeenCalledWith(userId);
    });
  });
});
