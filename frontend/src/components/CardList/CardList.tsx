import { Card } from '../utils/types/Card';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { CardContext } from '../../context/CardContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { Link } from 'react-router-dom';
import Button from '../utils/Button';
import CollapsibleTable from '../CollapsibleTable/CollapsibleTable';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import AccountDetails from '../utils/AccountDetails';
import CollapsibleList from '../CollapsibleList/CollapsibleList';
import { AccountContext } from '../../context/AccountContext';
import "./card.css";

interface CardListProps {
    cardList: Card[]
}

const CardList = ({ cardList }: CardListProps) => {
    const { t } = useTranslation();
    const { getUser } = useContext(UserContext);
    const { deleteCard } = useContext(CardContext);
    const { account } = useContext(AccountContext);
    const { handleError } = useApiErrorHandler();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [cards, setCards] = useState<Card[]>([]);

    const resetActiveIndex = () => {
        setActiveIndex(null);
    };

    useEffect(() => {
        setCards(cardList);
    }, [cardList]);

    const handleDelete = (id: string) => {
        const deleteCardItem = async () => {
            try {
                await deleteCard(id);
                resetActiveIndex();
                await getUser();
            } catch (error) {
                handleError(error);
            }
        };

        void deleteCardItem().then(() => {
            setCards(cards => cards.filter(x => x.id !== id));
        });
    };

    return (
        <div>
            <Link to={'/create-card/'} className="pr-12 pb-4">
                <div className="grid">
                    <Button className="justify-self-end mb-2 dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('cardList.submit')}</Button>
                </div>
            </Link>
            <div className="hidden md:block">
                <CollapsibleTable
                    headers={[
                        t('cardList.name'),
                        t('cardList.holderName')
                    ]}
                    rows={cards}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    renderRow={(card, activeIndex, hovering, idx) => (
                        <>
                            <td className={`px-4 py-2 text-center font-bold rounded-tl ${activeIndex !== idx ? 'rounded-bl' : ''} ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>
                                    <span className="block py-1">
                                        <b>{card.name}</b>
                                    </span>
                            </td>
                            <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>{card.holderName}</td>
                        </>
                    )}
                    renderRowDetails={(card) => (
                        <div className="flex flex-col items-center space-y-4 p-4 mt-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex w-full justify-evenly gap-1">
                                <div>
                                    <AccountDetails label={t('cardList.cardAccount')} account={account!} className='w-fit pl-4 p-3' />
                                </div>
                                <div>
                                    <Cards
                                        number={card.number}
                                        expiry={card.validThru}
                                        cvc={'232'}
                                        name={card.name}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 w-full">
                                <Link to={`/edit-card/${card.number}`} className="w-1/6">
                                    <Button className="w-full mt-1 dark:bg-slate-900 dark:hover:bg-slate-800">
                                        {t('cardList.edit')}
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(card.number!)} className="w-1/6 bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1 ml-10">
                                    {t('cardList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
            <div className="md:hidden">
                <CollapsibleList
                    items={cards}
                    renderHeader={(card) => (
                        <span>{card.name}</span>
                    )}
                    renderDetails={(card) => (
                        <div className="flex flex-col items-center space-y-4 p-2 mt-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex w-full justify-center">
                                <div>
                                    <AccountDetails label={t('cardList.cardAccount')} account={account!} className='w-fit pl-4 p-3' />
                                    <Cards
                                        number={card.number}
                                        expiry={card.validThru}
                                        cvc={'232'}
                                        name={card.name}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-center">
                                <Link to={`/edit-card/${card.number}`} className="w-full mt-1">
                                    <Button className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                                        {t('cardList.edit')}
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(card.number!)} className="w-full bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1">
                                    {t('cardList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default CardList;
