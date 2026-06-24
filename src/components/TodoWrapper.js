import React, {useState, useEffect} from "react"
import { TodoForm } from './TodoForm'
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
uuidv4();

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/todos")
    .then((res) => res.json())
    .then((data) => setTodos(data))
    .catch((err) => console.error(err));
  }, []);



const addTodo = async (todo) => {
  const response = await fetch("http://localhost:3001/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      task: todo,
      completed: false,
      isEditing: false,
    }),
  });

  const newTodo = await response.json();
  

  setTodos([...todos, newTodo]);
};
  
  const toggleComplete = id => {
    setTodos(todos.map(todo => todo.id === id ? 
      {...todo, completed: 
        todo.completed} :todo))
  }

  const deleteTodo =id => {
    setTodos(todos.filter(todo => todo.id !== id ))
  }

  const editTodo =id => {
     setTodos(todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing} :todo))
   
  }

  const editTask = async (task, id) => {
    const response = await fetch(
      `http://localhost:3001/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
        }),
      }
    );

    const updatedTodo = await response.json();
    setTodos(
      todos.map((todo)=>
        todo.id === id
      ? {...updatedTodo, isEditing: false}: todo
    ) 
    
    )

  }

  
 

 
  return(
    <div className='TodoWrapper'>
      <h1>Get things done!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map ((todo, index) => (
       todo.isEditing ? (
          <EditTodoForm editTask={editTask} task={todo}/>
        ):(<Todo task={todo} key={index} 
          toggleComplete={toggleComplete}
           deleteTodo={deleteTodo} editTask={editTodo}/>
      )
      
    ))}




    
    </div>
  );
};