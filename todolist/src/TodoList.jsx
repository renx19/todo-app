import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import ToDo from './ToDo';
import axios from 'axios';

const apiUrl = 'https://todo-app-backend-mu.vercel.app';
const addUrl = 'https://todo-app-backend-mu.vercel.app';
const updateUrl = 'https://todo-app-backend-mu.vercel.app';
const deleteUrl = 'https://todo-app-backend-mu.vercel.app';
const completeUrl = 'https://todo-app-backend-mu.vercel.app';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [totalTodos, setTotalTodos] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const fetchTodos = () => {
    axios.get(apiUrl)
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        // Display an error message to the user
      });
  };
  
  // In your render method, you can conditionally render based on the loading state
  if (loading) {
    return <p>Loading...</p>;
  }
  

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }
  
    axios.post(addUrl, todo)
      .then(response => {
        setTodos(prevTodos => [response.data, ...prevTodos]);
        // Clear the input field in the form
        // e.g., you can have a ref for your input and reset its value
      })
      .catch(error => console.error(error));
  };
  
  
  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    axios.put(`${updateUrl}/${todoId}`, { text: newValue.text })
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map((item) => (item._id === todoId ? { ...item, text: response.data.text } : item))
        );
      })
      .catch(error => console.error(error));
  };

  const removeTodo = (id) => {
    axios.delete(`${deleteUrl}/${id}`)
      .then(() => {
        // Use the correct property for comparison (_id instead of id)
        setTodos(prevTodos => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch(error => console.error(error));
  };
  

  const completeTodo = (id) => {
    axios.put(`${completeUrl}/${id}`)
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
