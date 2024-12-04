import { useState, useContext, FC } from 'react';
import Tile from '../../components/Tile/Tile';
import './FAQ.css';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import { FAQData } from './FAQData';
import { useTranslation } from 'react-i18next';

interface FAQItemProps {
    itemKey: string;
    isActive: boolean;
    onClick: () => void;
}

const FAQItem: FC<FAQItemProps> = ({ itemKey, isActive, onClick }) => {
    const { t } = useTranslation();

    return (
        <div className={`faq-item ${isActive ? 'active' : ''}`}>
            <div className="faq-question" onClick={onClick}>
                {t(`faq.${itemKey}.question`)}
            </div>
            {isActive && <div className="faq-answer">{t(`faq.${itemKey}.answer`)}</div>}
        </div>
    );
};

const FAQ: FC = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { user } = useContext(UserContext);

    const toggleAnswer = (index: number) => 
        setActiveIndex((prev) => (prev === index ? null : index));

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="faq-wrapper">
            <Tile title={t('faq.tile.title')} className="faq-tile">
                <div className="faq-container">
                    {FAQData.map((item, index) => (
                        <FAQItem
                            key={index}
                            itemKey={item.key}
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
