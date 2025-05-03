import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CardFormData, CardFormDataSchema } from '../../schemas/formValidation/cardSchema';
import { UserContext } from '../../context/UserContext';
import { AccountContext } from '../../context/AccountContext';
import { CardContext } from '../../context/CardContext';
import { Card } from '../../components/utils/types/Card';
import { scrollToTop } from '../../components/utils/scroll';
import ActiveAccountError from '../../components/ActiveAccountError/ActiveAccountError';
import Tile from '../../components/Tile/Tile';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/utils/Button';
import { FORMS, SUBMIT_BUTTONS } from '../../event/utils/constants';
import { triggerCustomFormSubmitEvent } from '../../event/eventCollectors/clickEvents';


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
                triggerCustomFormSubmitEvent(FORMS.CARD.id);
                navigate('/dashboard');
            } catch (error) {
                handleError(error);
                scrollToTop();
            }
        } else {
            try {
                await updateCard(cardNumber!, requestBody);
                await getUser();
                navigate('/dashboard');
            } catch (error) {
                handleError(error);
                scrollToTop();
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
                    <div id="form-error-alert">
                        { apiError.isError &&
                            <ErrorAlert alertMessage={apiError.errorMessage} />
                        }
                    </div>
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
                        <Button id={SUBMIT_BUTTONS.CARD.id} isSubmitting={isSubmitting} className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">
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
