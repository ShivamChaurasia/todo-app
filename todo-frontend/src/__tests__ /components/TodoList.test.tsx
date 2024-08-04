import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoContext } from '../../contexts/TodoContext';
import TodoList from '../../components/TodoList';

// Mock the context values
const mockToggleTodo = jest.fn();
const mockDeleteTodo = jest.fn();

// Sample todo data
const mockTodos = [
  { id: 1, title: 'First Todo', completed: false },
  { id: 2, title: 'Second Todo', completed: true },
];

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders "No todos found" when there are no todos', () => {
    render(
      <TodoContext.Provider
        value={{
          todos: [],
          toggleTodo: mockToggleTodo,
          deleteTodo: mockDeleteTodo,
          addTodo: jest.fn(),
        }}
      >
        <TodoList />
      </TodoContext.Provider>,
    );

    expect(screen.getByText('No todos found')).toBeInTheDocument();
  });

  test('renders todos correctly', () => {
    render(
      <TodoContext.Provider
        value={{
          todos: mockTodos,
          toggleTodo: mockToggleTodo,
          deleteTodo: mockDeleteTodo,
          addTodo: jest.fn(),
        }}
      >
        <TodoList />
      </TodoContext.Provider>,
    );

    // Check that the title of the todos is rendered
    expect(screen.getByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();

    // Check that completed todo has the correct styles
    expect(screen.getByText('Second Todo')).toHaveClass(
      'line-through text-gray-500',
    );
  });

  test('handles checkbox toggle', () => {
    render(
      <TodoContext.Provider
        value={{
          todos: mockTodos,
          toggleTodo: mockToggleTodo,
          deleteTodo: mockDeleteTodo,
          addTodo: jest.fn(),
        }}
      >
        <TodoList />
      </TodoContext.Provider>,
    );

    // Simulate a checkbox change
    fireEvent.click(screen.getAllByRole('checkbox')[0]);

    expect(mockToggleTodo).toHaveBeenCalledWith(1);
  });

  test('handles todo deletion', () => {
    render(
      <TodoContext.Provider
        value={{
          todos: mockTodos,
          toggleTodo: mockToggleTodo,
          deleteTodo: mockDeleteTodo,
          addTodo: jest.fn(),
        }}
      >
        <TodoList />
      </TodoContext.Provider>,
    );

    // Simulate a delete button click
    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });
});
