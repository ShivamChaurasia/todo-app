import React, { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

const TodoList: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useContext(TodoContext);

  return (
    <div>
      <h2>Todo List</h2>
      <ul className="list-disc pl-5">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
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
    </div>
  );
};

export default TodoList;
