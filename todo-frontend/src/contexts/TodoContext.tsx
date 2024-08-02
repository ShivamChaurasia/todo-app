import React, { createContext, useState, useEffect, ReactNode } from 'react';
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
    console.log('addTodo', title);
    const response = await axios.post('/todos', { title });
    setTodos([...todos, response.data]);
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      const response = await axios.patch(`/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
    }
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
