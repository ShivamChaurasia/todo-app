import React, { useContext, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import Button from './Button';
import toast from 'react-hot-toast';

const TodoForm: React.FC = () => {
  const { addTodo } = useContext(TodoContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setIsLoading(true);
      try {
        await addTodo(newTodo);
        setNewTodo('');
      } catch (err) {
        toast.error('Failed to create todo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new todo"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <Button type="submit" isLoading={isLoading} text="Add Todo" />
    </form>
  );
};

export default TodoForm;
