import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CardFormData, CardFormDataSchema } from '../../schemas/formValidation/cardSchema';
import { Card } from '../utils/types/Card';
import { UserContext } from '../../context/UserContext';
import { CardContext } from '../../context/CardContext';
import { scrollToTop } from '../utils/scroll';
import ActiveAccountError from '../ActiveAccountError/ActiveAccountError';
import { AccountContext } from '../../context/AccountContext';
import Tile from '../Tile/Tile';
import ErrorAlert from '../Alerts/ErrorAlert';
import FormInput from '../FormInput/FormInput';
import Button from '../utils/Button';

const CardForm = () => {
    const { t } = useTranslation();
    const { cardNumber } = useParams();
    const { user, getUser } = useContext(UserContext);
    const { activeAccount } = useContext(AccountContext);
    const { card, setCard, getCard, createCard, updateCard } = useContext(CardContext);
    const { apiError, handleError, clearApiError } = useApiErrorHandler();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<CardFormData>({
        resolver: zodResolver(CardFormDataSchema),
        defaultValues: {
            name: '',
            holderName: ''
        },
        mode: 'onSubmit'
    });
    const navigate = useNavigate();

    const setCardFormDefaultValues = useCallback(() => {
        setValue('name', '');
        setValue('holderName', '');
    }, [setValue]);

    const setCardFormEditValues = useCallback((card: Card) => {
        setValue('name', card.name);
        setValue('holderName', card.holderName);
    }, [setValue]);


    useEffect(() => {
        if (!user) return;

        if (cardNumber) {
            const fetchCardByCardNumber = async () => {
                try {
                    await getCard(cardNumber);
                } catch (error) {
                    handleError(error);
                }
            };

            fetchCardByCardNumber();
        } else {
            setCard(null);
        }
    }, [user, cardNumber, setCard, getCard]);

    useEffect(() => {
        if (card) {
            setCardFormEditValues(card);
        } else {
            setCardFormDefaultValues();
        }
    }, [card, setCardFormDefaultValues, setCardFormEditValues]);

    const getCardRequestBody = (data: CardFormData) => {
        return {
            name: data.name,
            holder_name: data.holderName
        };
    };

    const onSubmit: SubmitHandler<CardFormData> = async (data: CardFormData) => {
        clearApiError();
        const requestBody = getCardRequestBody(data);
        if (card === null) {
            try {
                await createCard(requestBody);
                await getUser();
                navigate('/cards');
            } catch (error) {
                handleError(error);
                scrollToTop('card-form-wrapper');
            }
        } else {
            try {
                await updateCard(cardNumber!, requestBody);
                await getUser();
                navigate('/cards');
            } catch (error) {
                handleError(error);
                scrollToTop('card-form-wrapper');
            }
        }
    };

    if (activeAccount === null) {
        return (
            <div id="card-form-wrapper" className="flex items-center justify-center">
                <ActiveAccountError />
            </div>);
    }

    return (
        <Tile title={t('cardForm.tile.title')}>
            <div className="flex items-center justify-center">
                <div className="max-w-md w-full mx-auto">
                    { apiError.isError &&
                        <div className="my-4">
                            <ErrorAlert alertMessage={apiError.errorMessage} />
                        </div>
                    }
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label={t('cardForm.name')}
                            fieldType="text"
                            register={register('name')}
                            error={errors.name}
                            className="w-full"
                        />
                        <FormInput
                            label={t('cardForm.holderName')}
                            fieldType="text"
                            register={register('holderName')}
                            error={errors.holderName}
                            className="w-full"
                        />
                        <Button isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
                            {isSubmitting
                                ? t('cardForm.loading')
                                : cardNumber
                                    ? t('cardForm.edit')
                                    : t('cardForm.submit')
                            }
                        </Button>
                    </form>
                </div>
            </div>
        </Tile>
    );
};

export default CardForm;
