
import {useState} from 'react';
// import Home from './Home'
import "./ToDoList.css";
import TodoList from './TodoList'

const App = () => {
  return (
    <div className="body-app" id='body-app'>
      <div className="todo-app" id='todo-app'>
     
        {/* <Home/> */}
       <TodoList />
   
     </div>
    </div>
  );
}

export default App;