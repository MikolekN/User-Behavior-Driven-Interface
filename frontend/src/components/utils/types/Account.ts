// not finished yet, need to specify all attributes

export interface Account {
    id: string | null;
    name: string;
    number: string;
    ownerId: string;
    availableFunds: number;
    balance: number;
    iban: string;
    openDate: Date;
}
