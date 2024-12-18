import React, { useState } from 'react';
import Cookies from 'js-cookie';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    // Store the name in a cookie with the key 'lcid'
    Cookies.set('lcid', name, { expires: 7 });
    // Trigger the callback to show the ChatPage
    onLogin(name);
    window.location.reload();
  };

  return (
    <div>
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
