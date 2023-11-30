import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import ToDo from './ToDo';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('http://localhost:3001/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error(error));
  };

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    fetch('http://localhost:3001/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
      .then(response => response.json())
      .then(data => {
        setTodos(prevTodos => [data, ...prevTodos]);
      })
      .catch(error => console.error(error));
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    fetch(`http://localhost:3001/update/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newValue.text }),
    })
      .then(response => response.json())
      .then(data => {
        setTodos(prevTodos =>
          prevTodos.map((item) => (item._id === todoId ? { ...item, text: data.text } : item))
        );
      })
      .catch(error => console.error(error));
  };

  const removeTodo = (id) => {
    fetch(`http://localhost:3001/delete/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(prevTodos => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch(error => console.error(error));
  };

  const completeTodo = (id) => {
    fetch(`http://localhost:3001/complete/${id}`, {
      method: 'PUT',
    })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, isComplete: !todo.isComplete } : todo
          )
        );

        if (todos.every((todo) => todo.isComplete)) {
          alert('Congratulations! You have completed all your to-do list.');
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div className='ToDoList'>
      <h1 className='td'>
        Set your plan for today <br />
        {todos.length === 0 ? '' : `${todos.filter((todo) => todo.isComplete).length} / ${todos.length}`} Complete
      </h1>

      <TodoForm onSubmit={addTodo} />
      <ToDo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </div>
  );
}

export default TodoList;
