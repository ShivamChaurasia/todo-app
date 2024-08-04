import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TodoProvider, TodoContext } from '../../contexts/TodoContext';
import axios from '../../lib/axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';
import { useContext } from 'react';

// Setup Mock for Axios
const mock = new MockAdapter(axios);

// Test Component
const TestComponent: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useContext(
    TodoContext,
  ) || {
    todos: [],
    addTodo: () => {},
    toggleTodo: () => {},
    deleteTodo: () => {},
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Add Todo"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTodo((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = '';
          }
        }}
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Tests
test('fetches and displays todos', async () => {
  const mockTodos = [{ id: 1, title: 'Sample Todo', completed: false }];
  mock.onGet('/todos').reply(200, mockTodos);

  render(
    <TodoProvider>
      <TestComponent />
    </TodoProvider>,
  );

  await screen.findByText(/Sample Todo/i);
});

test('adds a new todo', async () => {
  const mockTodos = [{ id: 1, title: 'Sample Todo', completed: false }];
  mock.onGet('/todos').reply(200, mockTodos);
  mock
    .onPost('/todos')
    .reply(201, { id: 2, title: 'New Todo', completed: false });

  render(
    <TodoProvider>
      <TestComponent />
    </TodoProvider>,
  );

  const input = screen.getByPlaceholderText(/add todo/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'New Todo' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  await screen.findByText(/New Todo/i);
});

test('toggles a todo', async () => {
  const mockTodos = [{ id: 1, title: 'Sample Todo', completed: false }];
  mock.onGet('/todos').reply(200, mockTodos);
  mock
    .onPut('/todos/1')
    .reply(200, { id: 1, title: 'Sample Todo', completed: true });

  render(
    <TodoProvider>
      <TestComponent />
    </TodoProvider>,
  );

  await screen.findByText(/Sample Todo/i);
  fireEvent.click(screen.getByText(/Complete/i));

  await waitFor(() =>
    expect(screen.getByText(/Sample Todo/i)).toHaveStyle(
      'text-decoration: line-through',
    ),
  );
});

test('deletes a todo', async () => {
  const mockTodos = [{ id: 1, title: 'Sample Todo', completed: false }];
  mock.onGet('/todos').reply(200, mockTodos);
  mock.onDelete('/todos/1').reply(200);

  render(
    <TodoProvider>
      <TestComponent />
    </TodoProvider>,
  );

  await screen.findByText(/Sample Todo/i);
  fireEvent.click(screen.getByText(/Delete/i));

  await waitFor(() => expect(screen.queryByText(/Sample Todo/i)).toBeNull());
});
