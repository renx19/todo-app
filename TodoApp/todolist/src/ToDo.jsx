import React, { useState } from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';
import TodoForm from './TodoForm';

function ToDo({ todos, completeTodo, removeTodo, updateTodo }) {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const handleEditClick = (todoId, todoText) => {
    setEdit({ id: todoId, value: todoText });
  };

  const handleRemoveClick = (todoId) => {
    removeTodo(todoId);
  };

  const handleCompleteClick = (todoId) => {
    completeTodo(todoId);
  };

  const submitUpdate = (value) => {
    updateTodo(edit.id, { text: value });
    setEdit({ id: null, value: '' });
  };

  if (edit.id) {
    // Render the TodoForm with edit mode if there is an edit id
    return (
      <TodoForm
        edit={edit}
        onSubmit={(value) => submitUpdate(value)}
      />
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <div className={todo.isComplete ? 'todo-row complete' : 'todo-row'} key={todo._id}>
          <div onClick={() => handleCompleteClick(todo._id)}>{todo.text}</div>
          <div className="icons">
            <BiEdit onClick={() => handleEditClick(todo._id, todo.text)} className="edit-icon" />
            <BiTrash onClick={() => handleRemoveClick(todo._id)} className="delete-icon" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToDo;
