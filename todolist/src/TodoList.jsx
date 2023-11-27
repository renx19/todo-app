import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import ToDo from './ToDo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('/api/todos') // Updated route using the proxy
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
        setLoading(false);
      });
  };

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    axios.post('/api/add', todo) // Updated route using the proxy
      .then(response => {
        setTodos(prevTodos => [response.data, ...prevTodos]);
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    axios.put(`/api/update/${todoId}`, { text: newValue.text }) // Updated route using the proxy
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map((item) => (item._id === todoId ? { ...item, text: response.data.text } : item))
        );
      })
      .catch(error => console.error(error));
  };

  const removeTodo = (id) => {
    axios.delete(`/api/delete/${id}`) // Updated route using the proxy
      .then(() => {
        setTodos(prevTodos => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch(error => console.error(error));
  };

  const completeTodo = (id) => {
    axios.put(`/api/complete/${id}`) // Updated route using the proxy
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
