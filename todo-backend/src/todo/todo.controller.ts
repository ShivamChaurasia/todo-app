import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './create-todo.dto';
import { UpdateTodoDto } from './update-todo.dto';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoDto } from './todo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  private getUserId(request: Request): number {
    const userId = request.user?.id;
    if (!userId) {
      throw new UnauthorizedException(); // Ensure the user is authenticated
    }
    return userId;
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of todos.' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() request: Request): Promise<Todo[]> {
    const userId = this.getUserId(request);
    return this.todoService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo by id' })
  @ApiResponse({ status: 200, description: 'The found todo' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<Todo> {
    const userId = this.getUserId(request);
    return this.todoService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'The todo has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() request: Request,
  ): Promise<TodoDto> {
    const userId = this.getUserId(request);
    return this.todoService.create(createTodoDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'The updated todo' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() request: Request,
  ): Promise<Todo> {
    const userId = this.getUserId(request);
    return this.todoService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 204, description: 'The todo has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: number,
    @Req() request: Request,
  ): Promise<void> {
    const userId = this.getUserId(request);
    return this.todoService.remove(id, userId);
  }
}
