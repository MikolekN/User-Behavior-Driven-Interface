import { useState, useContext } from 'react';
import Tile from '../../components/Tile/Tile';
import './FAQ.css';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import { FAQData } from './FAQData';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const toggleAnswer = (index: number) => { setActiveIndex(activeIndex === index ? null : index); };
    const { user } = useContext(UserContext);

    if (!user) return <Navigate to="/login" />; 

    return (
        <div className="flex items-center justify-center">
            <Tile title="FAQ" className="faq-tile">
                <div className="faq-container">
                    {FAQData.map((item, index) => (
                        <div key={index} className="faq-item">
                            <div
                                className="faq-question cursor-pointer font-bold"
                                onClick={() => toggleAnswer(index)}
                            >
                                Q{index + 1}. {item.question}
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer mt-2 text-gray-700">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Tile>
        </div>
    );
};

export default FAQ;
