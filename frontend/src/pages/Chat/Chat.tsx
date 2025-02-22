import { useState, useEffect, useContext, useRef, FC } from 'react';
import Tile from '../../components/Tile/Tile';
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
            setMessages([{ type: 'system', text: t('chat.welcomeMessage') }]);
        }
    }, [user, t]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage: Message = { type: 'user', text: message };
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');

        setTimeout(() => {
            setMessages((prev) => [...prev, { type: 'system', text: t('chat.responseMessage') }]);
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <Tile id="chat" title={t('chat.tile.title')}>
            <div className="flex flex-col flex-grow overflow-hidden w-full">
                {/* Messages display */}
                <div className="flex flex-col flex-grow overflow-y-auto p-2 space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                                msg.type === 'user'
                                    ? 'bg-blue-200 dark:bg-gray-700 self-end mr-2'
                                    : 'bg-gray-200 dark:bg-gray-600 self-start ml-2'
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex items-center p-2 border-t border-gray-300 dark:border-gray-700">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={t('chat.writeMessage')}
                        className="flex-grow p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-200"
                        aria-label="Send message"
                    >
                        <img src={send_arrow} alt="Send" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Tile>
    );
};

export default Chat;
