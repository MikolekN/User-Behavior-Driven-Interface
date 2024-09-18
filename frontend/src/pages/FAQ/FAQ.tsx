import { useState, useContext } from 'react';
import Tile from '../../components/Tile/Tile';
import './FAQ.css';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { FAQData } from './FAQData';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const { user } = useContext(AuthContext) || { user: null, fetchUser: () => Promise.resolve() };

  if (!user) return <Navigate to="/login" />

  return (
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
  );
};

export default FAQ;