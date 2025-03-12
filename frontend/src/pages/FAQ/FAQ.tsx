import { useState, FC } from 'react';
import Tile from '../../components/Tile/Tile';
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
        <div className='rounded-lg mb-2 border border-solid border-gray-300 dark:border-gray-800 transition-all duration-300 ease-in-out'>
            <div className={`rounded-t-md ${isActive ? '' : 'rounded-b-md'} p-2 bg-gray-50 dark:bg-gray-800 cursor-pointer font-bold transition-colors duration-200 ease-in hover:bg-gray-100 dark:hover:bg-gray-700`} onClick={onClick}>
                {t(`faq.${itemKey}.question`)}
            </div>
            {isActive && <div className="rounded-b-md p-3 bg-white dark:bg-gray-800">{t(`faq.${itemKey}.answer`)}</div>}
        </div>
    );
};

const FAQ: FC = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAnswer = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <Tile id="faq" title={t('faq.tile.title')}>
            <div className="md:p-6">
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
    );
};

export default FAQ;
