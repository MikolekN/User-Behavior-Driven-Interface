import { useState, useContext, FC } from 'react';
import Tile from '../../components/Tile/Tile';
import './FAQ.css';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FAQData } from './FAQData';

interface FAQItemProps {
    question: string;
    answer: string;
    isActive: boolean;
    onClick: () => void;
}

const FAQItem: FC<FAQItemProps> = ({ question, answer, isActive, onClick }) => (
    <div className={`faq-item ${isActive ? 'active' : ''}`}>
        <div className="faq-question" onClick={onClick}>
            {question}
        </div>
        {isActive && <div className="faq-answer">{answer}</div>}
    </div>
);

const FAQ: FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { user } = useContext(AuthContext);

    const toggleAnswer = (index: number) => 
        setActiveIndex((prev) => (prev === index ? null : index));

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="faq-wrapper">
            <Tile title="Frequently Asked Questions" className="faq-tile">
                <div className="faq-container">
                    {FAQData.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isActive={activeIndex === index}
                            onClick={() => toggleAnswer(index)}
                        />
                    ))}
                </div>
            </Tile>
        </div>
    );
};

export default FAQ;
