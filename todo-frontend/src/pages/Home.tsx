import React, { useContext, useState } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { AuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      await addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </form>
        <ul className="list-disc pl-5">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between mb-2"
            >
              <span
                className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-rose-500 hover:text-rose-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="w-full bg-rose-600 text-white p-2 rounded mt-4 hover:bg-rose-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
