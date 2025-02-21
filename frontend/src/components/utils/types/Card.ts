export interface Card {
    id: string | null;
    holderName: string;
    name: string;
    validThru: string;
    number: string;
};

export interface BackendCard {
    _id: string | null;
    account: string;
    created: string;
    holder_name: string;
    is_deleted: boolean;
    name: string;
    number: string;
    valid_thru: string;
};

export const mapBackendCardToCard = (backendCardData: BackendCard): Card => {
    return {
        id: backendCardData._id,
        holderName: backendCardData.holder_name,
        name: backendCardData.name,
        validThru: backendCardData.valid_thru,
        number: backendCardData.number
    };
};

export const mapBackendCardsListToCards = (backendCardsData: BackendCard[]): Card[] => {
    const frontendCards: Card[] = [];
    backendCardsData.forEach((backendCardData: BackendCard) => {
        const cardFrontendData = mapBackendCardToCard(backendCardData);
        frontendCards.push(cardFrontendData); 
    });

    return frontendCards;
};