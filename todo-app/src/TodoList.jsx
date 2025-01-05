import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoList() {
    const [todos, setTodos] = useState([]); // Initialize as an empty array
    const [newTodo, setNewTodo] = useState('');

    // Fetch all tasks from the database when the component loads
    useEffect(() => {
        axios.get('http://localhost:3001/todos')
            .then(response => {
                console.log('Fetched Todos:', response.data);
                setTodos(response.data); // Set the fetched tasks
            })
            .catch(err => console.error('Error fetching todos:', err));
    }, []);

    // Add a new task to the database
    const addNewTask = () => {
        if (!newTodo.trim()) return; // Prevent adding empty tasks
        axios.post('http://localhost:3001/add', { task: newTodo, isDone: false })
            .then(result => {
                console.log('Task Added:', result.data);
                setTodos(prevTodos => [...prevTodos, result.data]); // Add new task to the list
                setNewTodo(''); // Clear input field
            })
            .catch(err => console.error('Error adding task:', err));
    };

    // Delete a task
    const deleteTodo = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            })
            .catch(err => console.error('Error deleting task:', err));
    };

    // Mark a task as completed
    const completeTodo = (id) => {
        const todoToUpdate = todos.find(todo => todo._id === id);
        if (!todoToUpdate) return;

        axios.put(`http://localhost:3001/update/${id}`, { isDone: !todoToUpdate.isDone })
            .then(() => {
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo._id === id ? { ...todo, isDone: !todo.isDone } : todo
                    )
                );
            })
            .catch(err => console.error('Error updating task:', err));
    };

    const upperCaseAll = () => {
        setTodos((prevTodo) =>
            prevTodo.map((todo) => {
                return {
                    ...todo,
                    task: todo.task.toUpperCase(),
                    // console.log(todo)
                };
            })
        );
    };

    const completedAll = () => {
        axios.put('http://localhost:3001/updateAll', { isDone: true }) // Set `isDone` to true
            .then(() => {
                setTodos(prevTodos =>
                    prevTodos.map(todo => ({ ...todo, isDone: true })) // Update all items in the local state
                );
            })
            .catch(err => console.error('Error marking all as read:', err));
    };

    const deleteAll = () => {
        axios.delete('http://localhost:3001/deleteAll')
            .then(() => {
                setTodos([]); // Clear all tasks from the local state
            })
            .catch(err => console.error('Error deleting all tasks:', err));
    };
    


    return (
        <div className="container">
            <input
                type="text"
                placeholder="Enter Task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                style={{ borderRadius: '15px', width: '400px', height:"45px", margin:"5px"}}
            />
            <button onClick={addNewTask}>Add Todo</button>
            <hr style={{ height: '5px', backgroundColor: 'red', border: '1px solid black' }} />

            <h4>Tasks Todo</h4>
            <div>
                {todos.map((todo) => (
                    <p
                        key={todo._id}
                        style={{
                            border: '1px solid black',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            minHeight: '50px',
                            borderRadius: '25px',
                        }}
                    >
                        <span
                            style={{
                                flexGrow: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textDecoration: todo.isDone ? 'line-through' : 'none',
                            }}
                        >
                            {todo.task}
                        </span>
                        <span style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{
                                    backgroundColor: 'red',
                                    borderRadius: '25px',
                                    color: 'white',
                                    border: 'none',
                                }}
                                onClick={() => deleteTodo(todo._id)}
                            >
                                X
                            </button>
                            <button
                                style={{
                                    backgroundColor: 'green',
                                    borderRadius: '25px',
                                    color: 'white',
                                    border: 'none',
                                }}
                                onClick={() => completeTodo(todo._id)}
                            >
                                <i className="fa-solid fa-check"></i>
                            </button>
                        </span>
                    </p>
                ))}
            </div>
            <div>
                <button onClick={upperCaseAll}>Upper Case All</button>
                <button style={{ backgroundColor: "green", marginLeft: "10px" }} onClick={completedAll} >Mark All Completed</button>
                <button style={{ backgroundColor: "red", marginLeft: "10px" }} onClick={deleteAll} >Delete All</button>
            </div>
        </div>
    );
}
