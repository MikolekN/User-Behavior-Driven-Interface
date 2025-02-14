import { useState, useEffect, useContext, useRef, FC } from 'react';
import Tile from '../../components/Tile/Tile';
import './Chat.css';
import send_arrow from '../../assets/images/send.png';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

type MessageType = 'user' | 'system';

interface Message {
    type: MessageType;
    text: string;
}

const Chat: FC = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useContext(UserContext);
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (user) {
            setMessages([
                {
                    type: 'system',
                    text: `${t('chat.welcomeMessage')}`,
                },
            ]);
        }
    }, [user]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage: Message = { type: 'user', text: message };
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { type: 'system', text: `${t('chat.responseMessage')}` },
            ]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="chat-wrapper">
            <Tile title={t('chat.tile.title')} className="chat-tile">
                <div className="chat-container">
                    <div className="message-display">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type} `}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={t('chat.writeMessage')}
                            className="chat-input"
                        />
                        <button onClick={handleSend} className="send-button" aria-label="Send message">
                            <img src={send_arrow} alt="Send" className="send-icon" />
                        </button>
                    </div>
                </div>
            </Tile>
        </div>
    );
};

export default Chat;
