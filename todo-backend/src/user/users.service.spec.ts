import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { AppUser } from './app-user.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<AppUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(AppUser),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<AppUser>>(
      getRepositoryToken(AppUser),
    );
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as AppUser;
      userRepository.findOneBy = jest.fn().mockResolvedValue(user);

      expect(await userService.findOneById(1)).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(userService.findOneById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      } as AppUser;
      userRepository.findOneBy = jest.fn().mockResolvedValue(user);

      expect(await userService.findOneByEmail('test@example.com')).toEqual(
        user,
      );
    });

    it('should return undefined if user is not found', async () => {
      userRepository.findOneBy = jest.fn().mockResolvedValue(undefined);

      expect(
        await userService.findOneByEmail('test@example.com'),
      ).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
      } as AppUser;
      userRepository.create = jest.fn().mockReturnValue(user);
      userRepository.save = jest.fn().mockResolvedValue(user);

      expect(
        await userService.create('test@example.com', 'hashedPassword'),
      ).toEqual(user);
    });
  });

  describe('findByRefreshToken', () => {
    it('should return a user if found by refresh token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        refreshToken: 'refreshToken',
      } as AppUser;
      userRepository.findOne = jest.fn().mockResolvedValue(user);

      expect(await userService.findByRefreshToken('refreshToken')).toEqual(
        user,
      );
    });

    it('should return undefined if user is not found by refresh token', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      expect(
        await userService.findByRefreshToken('refreshToken'),
      ).toBeUndefined();
    });
  });

  describe('updateRefreshToken', () => {
    it('should call update on the repository with the correct parameters', async () => {
      const userId = 1;
      const refreshToken = 'newRefreshToken';
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      await userService.updateRefreshToken(userId, refreshToken);

      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        refreshToken,
      });
    });
  });

  describe('clearRefreshToken', () => {
    it('should call update on the repository with null refreshToken', async () => {
      const userId = 1;
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });

      await userService.clearRefreshToken(userId);

      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        refreshToken: null,
      });
    });
  });
});
