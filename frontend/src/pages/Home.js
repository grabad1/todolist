import React, { useState, useEffect } from 'react';
import '../App.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // instaliraj ako nisi: npm install axios

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [firstAttempt, setFirstAttempt] = useState(() => {
    return localStorage.getItem('firstAttempted') !== 'true';
  });

  const handleGoToLogin = () => {
    localStorage.setItem('firstAttempted', 'true');
    setFirstAttempt(false);
    navigate("/login");
  };
  //promena
  useEffect(() => {
    axios.get(`${API_URL}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const [input, setInput] = useState('');

  const addTask = async () => {
    if (firstAttempt) {
      handleGoToLogin()
    }
    else {
      if (input.trim() === '') return;
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input })
        });
        if (!response.ok) throw new Error('Nešto nije u redu sa serverom');

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setInput('');
      } catch (er) { console.error(er) }
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Greška pri brisanju taska');

      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error(error);
      alert('Nešto nije u redu pri brisanju taska');
    }
  };

  const patchTask = async (id) => {
    try {
      const task = tasks.find(task => task._id == id)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done })
      });

      if (!response.ok) throw new Error('Greška pri petcu taska');

      setTasks(tasks.map(task => task._id === id ? { ...task, done: !task.done } : task));
    } catch (error) {
      console.error(error);
      alert('Nešto nije u redu pri brisanju taska');
    }
  };

  return (
    <div id='cont' style={{ padding: 20 }}>
      <h1>To-Do lista</h1>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Unesi zadatak"
      />
      <button onClick={addTask}>Dodaj</button>
      <ul>
        {tasks.map(task => (
          <li
            className={task.done ? 'done' : 'not-done'}
            key={task._id}
          >
            <p onClick={() => patchTask(task._id)} style={{ textDecoration: task.done ? 'line-through' : 'none', cursor: 'pointer' }}>{task.text}</p>
            <p onClick={() => deleteTask(task._id)}>X</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;