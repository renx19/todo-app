import React, { useState, useEffect } from 'react';

function TodoForm({ onSubmit, edit }) {
  const [input, setInput] = useState(edit ? edit.value : '');

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text: input }); // Pass an object with 'text' property
    setInput('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={edit ? 'Update your todo' : 'Add a new todo'}
        value={input}
        name="text"
        className="todo-input"
        onChange={handleChange}
      />
      <button className="todo-button" type="submit">
        {edit ? 'Update' : 'Add todo'}
      </button>
    </form>
  );
}

export default TodoForm;
