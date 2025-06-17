import React, { useState } from 'react';
import '../App.css'
import { useNavigate } from 'react-router-dom';
import Home from './Home';
function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState('')
    const [pasword, setPasword] = useState('')
    const goHome = () => {
        navigate('/')
    }
  return (
    
    <div id='cont' style={{ padding: 20 }}>
      <h1>Login</h1>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Username"
      />
      <input
        type='password' 
        value={pasword} 
        onChange={e => setPasword(e.target.value)} 
        placeholder="Password"
      />
      <button onClick={() => goHome()}>Dodaj</button>
    </div>
  );
}

export default Login;