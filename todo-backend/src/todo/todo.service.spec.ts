import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { TodoDto } from './todo.dto';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<Todo>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    userService = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of todos for a user', async () => {
      const userId = 1;
      const todos = [
        { id: 1, title: 'Test Todo', user: { id: userId } },
      ] as Todo[];
      jest.spyOn(todoRepository, 'find').mockResolvedValue(todos);

      expect(await todoService.findAll(userId)).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return a todo if found', async () => {
      const userId = 1;
      const todo = { id: 1, title: 'Test Todo', user: { id: userId } } as Todo;
      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(todo);

      expect(await todoService.findOne(1, userId)).toEqual(todo);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      const userId = 1;
      jest.spyOn(todoRepository, 'findOne').mockResolvedValue(null);

      await expect(todoService.findOne(1, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a todo', async () => {
      const userId = 1;
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };
      const user = { id: userId } as any;
      const savedTodo = {
        id: 1,
        ...createTodoDto,
        completed: false,
        user,
      } as Todo;
      const todoDto: TodoDto = { id: 1, title: 'New Todo', completed: false };

      jest.spyOn(userService, 'findOneById').mockResolvedValue(user);
      jest.spyOn(todoRepository, 'create').mockReturnValue(savedTodo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(savedTodo);

      expect(await todoService.create(createTodoDto, userId)).toEqual(todoDto);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 1;
      const createTodoDto: CreateTodoDto = { title: 'New Todo' };
      jest.spyOn(userService, 'findOneById').mockResolvedValue(null);

      await expect(todoService.create(createTodoDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a todo', async () => {
      const userId = 1;
      const todo = { id: 1, title: 'Old Todo', user: { id: userId } } as Todo;
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      const updatedTodo = { ...todo, ...updateTodoDto };

      jest.spyOn(todoService, 'findOne').mockResolvedValue(todo);
      jest.spyOn(todoRepository, 'save').mockResolvedValue(updatedTodo);

      expect(await todoService.update(1, updateTodoDto, userId)).toEqual(
        updatedTodo,
      );
    });

    it('should throw NotFoundException if todo to update is not found', async () => {
      const userId = 1;
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };
      jest.spyOn(todoService, 'findOne').mockResolvedValue(null);

      await expect(
        todoService.update(1, updateTodoDto, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const userId = 1;
      const todo = {
        id: 1,
        title: 'Todo to remove',
        user: { id: userId },
      } as Todo;
      jest.spyOn(todoService, 'findOne').mockResolvedValue(todo);
      jest.spyOn(todoRepository, 'remove').mockResolvedValue(undefined);

      await expect(todoService.remove(1, userId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if todo to remove is not found', async () => {
      const userId = 1;
      jest.spyOn(todoService, 'findOne').mockResolvedValue(null);

      await expect(todoService.remove(1, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
