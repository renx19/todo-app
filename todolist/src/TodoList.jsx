import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import ToDo from './ToDo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('https://todo-app-backend-sooty.vercel.app/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  };
  
  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
  
    axios.post('https://todo-app-backend-sooty.vercel.app/add', todo)
      .then(response => {
        setTodos(prevTodos => [response.data, ...prevTodos]);
      })
      .catch(error => console.error(error));
  };
  
  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }
  
    axios.put(`https://todo-app-backend-sooty.vercel.app/update/${todoId}`, { text: newValue.text })
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map((item) => (item._id === todoId ? { ...item, text: response.data.text } : item))
        );
      })
      .catch(error => console.error(error));
  };
  
  const removeTodo = (id) => {
    axios.delete(`https://todo-app-backend-sooty.vercel.app/delete/${id}`)
      .then(() => {
        // Use the correct property for comparison (_id instead of id)
        setTodos(prevTodos => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch(error => console.error(error));
  };
  
  const completeTodo = (id) => {
    axios.put(`https://todo-app-backend-sooty.vercel.app/complete/${id}`)
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
