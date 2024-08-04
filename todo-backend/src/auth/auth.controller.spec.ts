import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { jest } from '@jest/globals';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            signup: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const result = { accessToken: 'token', refreshToken: 'token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toEqual(result);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signup', () => {
    it('should return a token on successful signup', async () => {
      const signupDto = { email: 'test@example.com', password: 'password' };
      const result = { accessToken: 'token' };

      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      expect(await authController.signup(signupDto)).toEqual(result);
    });

    it('should throw UnauthorizedException if signup fails', async () => {
      const signupDto = { email: 'test@example.com', password: 'password' };

      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.signup(signupDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a new token on successful refresh', async () => {
      const refreshTokenDto = { refreshToken: 'oldToken' };
      const result = { accessToken: 'newToken', refreshToken: 'token' };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await authController.refreshToken(refreshTokenDto)).toEqual(
        result,
      );
    });

    it('should throw UnauthorizedException if refresh fails', async () => {
      const refreshTokenDto = { refreshToken: 'oldToken' };

      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        authController.refreshToken(refreshTokenDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyToken', () => {
    it('should return user data if token is valid', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const req = { user };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      expect(await authController.verifyToken(req)).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should return a success message on successful logout', async () => {
      const req = { user: { id: 1 } };

      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      expect(await authController.logout(req)).toEqual({
        message: 'Logged out successfully',
      });
    });

    it('should throw UnauthorizedException if logout fails', async () => {
      const req = { user: { id: 1 } };

      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.logout(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
