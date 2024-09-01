import { useState, useEffect } from 'react';
import Tile from '../components/Tile/Tile';
import './Chat.css';
import send_arrow from '../assets/images/send.png';

type MessageType = 'user' | 'system';

interface Message {
  type: MessageType;
  text: string;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        type: 'system',
        text: 'Witamy na czacie obsługi klienta! Nie wahaj się zadać pytań, a my chętnie Ci pomożemy.',
      },
    ]);
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: message }
      ]);
  
      setMessage('');
  
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'system',
            text: 'Dziękujemy za wiadomość! Nasz zespół wkrótce się z Tobą skontaktuje.' }
        ]);
      }, 500);
    }
  };

  return (
    <Tile title="Czat" className="chat-tile">
      <div className="chat-container">
        <div className="message-display">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Napisz wiadomość..."
            className="chat-input"
          />
          <button onClick={handleSend} className="send-button">
            <img src={send_arrow} alt="Send" className="send-icon" />
          </button>
        </div>
      </div>
    </Tile>
  );
};

export default Chat;
