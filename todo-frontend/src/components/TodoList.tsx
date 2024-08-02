import React, { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

const TodoList: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useContext(TodoContext);

  return (
    <div className="mt-8 pt-8 border-t">
      {todos.length === 0 ? (
        <p>No todos found</p>
      ) : (
        <h1 className="text-2xl mb-4">Todo List</h1>
      )}
      <ul className="list-disc">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <div className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <h5
                className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
              >
                {todo.title}
              </h5>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-primary-500 hover:text-primary-400"
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
