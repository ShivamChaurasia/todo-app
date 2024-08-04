import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { AppUser } from '../user/app-user.entity';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test_secret'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  describe('validate', () => {
    it('should return user if found', async () => {
      const payload: JwtPayload = { email: 'test@example.com' };
      const user: AppUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        todos: [],
      }; // Example user object

      userService.findOneByEmail = jest.fn().mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(payload.email);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload: JwtPayload = { email: 'test@example.com' };

      userService.findOneByEmail = jest.fn().mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
