import React, { useContext, useEffect, useState } from 'react';
import CardList from '../../components/CardList/CardList';
import { useTranslation } from 'react-i18next';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { CardContext } from '../../context/CardContext';
import { UserContext } from '../../context/UserContext';
import DefaultLoadingSkeleton from '../../components/Loading/DefaultLoadingSkeleton';
import EmptyResponseInfoAlert from '../../components/EmptyResponseInfoAlert/EmptyResponseInfoAlert';
import { Link } from 'react-router-dom';
import Button from '../../components/utils/Button';
import Tile from '../../components/Tile/Tile';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';
import { AccountContext } from '../../context/AccountContext';

const Cards = () => {
    const { t } = useTranslation();
    const { apiError, handleError } = useApiErrorHandler();
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const { account } = useContext(AccountContext);
    const { cards, getCards } = useContext(CardContext);


    useEffect(() => {
        if (!user) return;

        const fetchCards = async () => {
            try {
                await getCards();
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCards();
    }, [user, getCards]);

    if (loading) return <DefaultLoadingSkeleton />;

    if (account === null) {
        return (
            <div id="cards-wrapper" className="flex items-center justify-center">
                <ActiveAccountError />
            </div>
        );
    }

    if (apiError.isError) {
        return (
            <EmptyResponseInfoAlert
                title={t('cardList.tile.title')}
                alertTitle={t('cardList.emptyList')}
                alertMessage={apiError.errorMessage}
            >
                <Link to={'/create-card/'} className="justify-self-end p-2">
                    <Button className="dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('cardList.submit')}</Button>
                </Link>
            </EmptyResponseInfoAlert>
        );
    };

    return (
        <div id='card-wrapper' className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={t('cardList.tile.title')} className='flex flex-col w-10/12 shadow-md h-[95%] max-h-[95%] mb-2.5 mx-auto rounded-lg md:w-1/2'>
                <div className="flex flex-col gap-4 overflow-y-auto p-2.5">
                    {!cards && (
                        <div>Cyclic Payments are loading...</div>
                    )}
                    {cards && cards.length > 0 && (
                        <CardList cardList={cards}/>
                    )}
                </div>
            </Tile>
        </div>
    );
};

export default Cards;