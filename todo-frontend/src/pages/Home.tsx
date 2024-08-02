import React from 'react';
import { TodoProvider } from '../contexts/TodoContext';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Card from '../components/Card';

const Home: React.FC = () => {
  return (
    <TodoProvider>
      <Card>
        <TodoForm />
        <TodoList />
      </Card>
    </TodoProvider>
  );
};

export default Home;
