import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import axios from '../lib/axios';
import { Todo } from '../types/todo';

interface TodoContextProps {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  addTodo: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
});

export const TodoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('/todos');
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    const response = await axios.post('/todos', { title });
    setTodos((prevTodos) => [...prevTodos, response.data]);
  };

  const toggleTodo = useCallback(
    async (id: number) => {
      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        const response = await axios.put(`/todos/${id}`, {
          ...todo,
          completed: !todo.completed,
        });
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === id ? response.data : t)),
        );
      }
    },
    [todos],
  );

  const deleteTodo = async (id: number) => {
    await axios.delete(`/todos/${id}`);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const values = useMemo(
    () => ({ todos, addTodo, toggleTodo, deleteTodo }),
    [todos, toggleTodo],
  );

  return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;
};
