import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { TodoDto } from './todo.dto';

describe('TodoController', () => {
  let todoController: TodoController;

  const mockTodoService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = (userId: number) =>
    ({
      user: { id: userId },
    }) as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock JwtAuthGuard
      .compile();

    todoController = module.get<TodoController>(TodoController);
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const userId = 1;
      const result: Todo[] = [
        { id: 1, title: 'Test Todo', completed: false },
      ] as Todo[];
      mockTodoService.findAll.mockResolvedValue(result);

      expect(await todoController.findAll(mockRequest(userId))).toBe(result);
    });

    it('should throw UnauthorizedException if no user ID in request', async () => {
      const result = todoController.findAll({ user: null } as any);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOne', () => {
    it('should return a todo', async () => {
      const userId = 1;
      const id = 1;
      const result: Todo = { id, title: 'Test Todo', completed: false } as Todo;
      mockTodoService.findOne.mockResolvedValue(result);

      expect(await todoController.findOne(id, mockRequest(userId))).toBe(
        result,
      );
    });

    it('should throw UnauthorizedException if no user ID in request', async () => {
      const result = todoController.findOne(1, { user: null } as any);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    it('should create a new todo and return it', async () => {
      const userId = 1;
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };
      const result: TodoDto = { id: 1, title: 'New Todo', completed: false };
      mockTodoService.create.mockResolvedValue(result);

      expect(
        await todoController.create(createTodoDto, mockRequest(userId)),
      ).toBe(result);
    });

    it('should throw UnauthorizedException if no user ID in request', async () => {
      const result = todoController.create({ title: 'New Todo' }, {
        user: null,
      } as any);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('update', () => {
    it('should update and return the todo', async () => {
      const userId = 1;
      const id = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        completed: true,
      };
      const result: Todo = {
        id,
        title: 'Updated Todo',
        completed: true,
      } as Todo;
      mockTodoService.update.mockResolvedValue(result);

      expect(
        await todoController.update(id, updateTodoDto, mockRequest(userId)),
      ).toBe(result);
    });

    it('should throw UnauthorizedException if no user ID in request', async () => {
      const result = todoController.update(
        1,
        { title: 'Updated Todo', completed: true },
        { user: null } as any,
      );

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const userId = 1;
      const id = 1;
      mockTodoService.remove.mockResolvedValue(undefined);

      await expect(
        todoController.remove(id, mockRequest(userId)),
      ).resolves.toBeUndefined();
    });

    it('should throw UnauthorizedException if no user ID in request', async () => {
      const result = todoController.remove(1, { user: null } as any);

      await expect(result).rejects.toThrow(UnauthorizedException);
    });
  });
});
