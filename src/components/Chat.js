import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import './css/Chatpage.css';

let username;
username = Cookies.get('lcid');

const socket = io('https://testprosses.onrender.com');

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const [isUserActive, setIsUserActive] = useState(true);

  if (!isUserActive == false) {
    document.title = "LunaChat home page";
  }

  useEffect(() => {
    socket.on('message', (data) => {
      setChat((prevChat) => {
        if (!prevChat.some(msg => msg.message === data.message && msg.user === data.user)) {
          return [...prevChat, data];
        }
        return [...prevChat, data];
      });
    });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsUserActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (isUserActive === false) {
      document.title = "(1) New Message";
    } else if (isUserActive === true) {
      document.title = "LunaChat home page";
    }

    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.length >= 0) {
      socket.emit('message', {
        message: message,
        user: username,
      });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
      </div>
      <div className="chat-body">
        <div className="chat">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={msg.user === username ? "my-message" : "other-message"}
            >
              {msg.message}
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>
      <div className="chat-footer">
        <form onSubmit={sendMessage} className="chat-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Type your message..."
            className="chat-input"
          ></textarea>
          <button type="submit" className="chat-send-btn">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
