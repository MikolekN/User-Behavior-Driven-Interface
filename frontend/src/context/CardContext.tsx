import { createContext, ReactNode, useCallback, useMemo, useState } from "react";
import { Card, mapBackendCardsListToCards, mapBackendCardToCard } from "../components/utils/types/Card";
import { createCardData, deleteCardData, getCardData, getCardsData, updateCardData } from "../services/cardService";


interface CardContextProps {
    card: Card | null;
    setCard: React.Dispatch<React.SetStateAction<Card | null>>;
    cards: Card[] | null;
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    createCard: (requestBody: object) => Promise<void>;
    getCard: (cardNumber: string) => Promise<void>;
    deleteCard: (cardNumber: string) => Promise<void>;
    updateCard: (cardNumber: string, requestBody: object) => Promise<void>;
    getCards: () => Promise<void>;
}

const defaultContextValue: CardContextProps = {
    card: null,
    setCard: () => {},
    cards: null,
    setCards: () => {},
    createCard: async () => {},
    getCard: async () => {},
    deleteCard: async () => {},
    updateCard: async () => {},
    getCards: async () => {}
};

export const CardContext = createContext<CardContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [card, setCard] = useState<Card | null>(null);
    const [cards, setCards] = useState<Card[]>([]);

    const createCard = useCallback(async (requestBody: object): Promise<void> => {
        await createCardData(requestBody);
    }, []);

    const getCard = useCallback(async (cardNumber: string): Promise<void> => {
        const { card: backendCardData } = await getCardData(cardNumber);
        if (backendCardData) {
            setCard(mapBackendCardToCard(backendCardData));
        }
    }, []);

    const deleteCard = useCallback(async (cardNumber: string): Promise<void> => {
        await deleteCardData(cardNumber);
    }, []);

    const updateCard = useCallback(async (cardNumber: string, requestBody: object): Promise<void> => {
        await updateCardData(cardNumber, requestBody);
    }, []);

    const getCards = useCallback(async (): Promise<void> => {
        const { cards: cardsBackendData } = await getCardsData();
        if (cardsBackendData) {
            setCards(mapBackendCardsListToCards(cardsBackendData));
        }
    }, []);

    const CardContextValue = useMemo(() => ({
        card,
        setCard,
        cards,
        setCards,
        createCard,
        getCard,
        deleteCard,
        updateCard,
        getCards
    }), [card, setCard, cards, setCards, 
        createCard, getCard, deleteCard,
        updateCard, getCards]);

    return (
        <CardContext.Provider value={CardContextValue}>
            {children}
        </CardContext.Provider>
    );
};