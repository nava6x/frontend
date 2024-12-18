import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ChatPage from './components/Chat';
import Cookies from 'js-cookie';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Check if the user is already logged in (cookie exists)
  useEffect(() => {
    const storedName = Cookies.get('lcid');
    if (storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    }
  }, []);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatPage />
      )}
    </div>
  );
};

export default App;
