import React, { useContext } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { TodoProvider } from '../contexts/TodoContext';
import { AuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { logout } = useContext(AuthContext);
  return (
    <TodoProvider>
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-4">Todo List</h1>
          <TodoForm />
          <TodoList />
          <button
            onClick={logout}
            className="w-full bg-rose-600 text-white p-2 rounded mt-4 hover:bg-rose-700"
          >
            Logout
          </button>
        </div>
      </div>
    </TodoProvider>
  );
};

export default Home;
