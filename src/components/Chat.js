import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import './css/Chatpage.css'

let username;
username = Cookies.get('lcid');

const socket = io('https://testprosses.onrender.com');

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);  // Reference to the chat end for scrolling
  const [key, setKey] = useState('');
  const [typins, setTypings] = useState([]);

  const handleKeyDown = (event) => {
    setKey("Typing"); // Set the key when pressed

    // Reset the displayed key after 0.3 seconds
    setTimeout(() => {
      setKey('');
    }, 3000);
  };

  useEffect(() => {
    // Listen for new messages from the server
    socket.on('message', (data) => {
      setChat((prevChat) => {
        // Only add new messages if they're not already in the chat
        if (!prevChat.some(msg => msg.message === data.message && msg.user === data.user)) {
          return [...prevChat, data];  // Append new message if it's not a duplicate
        }
        return prevChat;  // Return existing chat if message is a duplicate
      });
    });

    socket.on('typing', (data) => {
        setTypings(data); // Update state with the received object
      });

  }, []);
  if(!message.length == 0){
    socket.emit('typing', {
        indicate: key,
        user:username
      });
  }
    
  // Auto-scroll to the bottom every time the chat changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      socket.emit('message', {
        message: message,
        user: username,
      });
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="App">
      <div className="chat">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={msg.user === username ? "my-message" : "other-message"}
          >
            {msg.message}
          </div>
        ))}
        <div ref={chatEndRef} /> {/* This will be used to scroll to the bottom */}
      </div>
      <header className="App-header">
        <form onSubmit={sendMessage}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            onKeyDown={handleKeyDown}
          />
          <button type="submit">Send</button>
        <div>
        </div>
        <div 
        className={typins.user === username ? "mytype":"othertype"}
        >
        <p>
        {typins.indicate}
        </p>
        </div>
        </form>
      </header>
    </div>
  );
}

export default ChatPage;
