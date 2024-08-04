import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoContext } from '../../contexts/TodoContext';
import TodoForm from '../../components/TodoForm';
import { jest } from '@jest/globals';

const mockAddTodo = jest.fn();

describe('TodoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(<TodoForm />);

    expect(screen.getByPlaceholderText('Enter new todo')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  test('updates the input value', () => {
    render(<TodoForm />);

    const input = screen.getByPlaceholderText(
      'Enter new todo',
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });

    expect(input.value).toBe('New Todo');
  });

  test('calls addTodo and handles loading state', async () => {
    render(
      <TodoContext.Provider
        value={{
          addTodo: mockAddTodo,
          todos: [],
          toggleTodo: jest.fn(),
          deleteTodo: jest.fn(),
        }}
      >
        <TodoForm />
      </TodoContext.Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter new todo'), {
      target: { value: 'New Todo' },
    });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith('New Todo');
    });
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter new todo')).toHaveValue(''); // Input should be cleared
    });
    await waitFor(() => {
      expect(screen.getByText('Add Todo')).not.toBeDisabled(); // Button should be enabled again
    });
  });

  test('does not call addTodo if input is empty', () => {
    render(<TodoForm />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockAddTodo).not.toHaveBeenCalled();
  });
});
