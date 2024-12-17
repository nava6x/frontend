import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://testprosses.onrender.com');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setChat([...chat, data]);
    });

    return () => {
      socket.off('message');
    };
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Socket.io Chat</h1>
        <form onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button type="submit">Send</button>
        </form>
        <div className="chat">
          {chat.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
