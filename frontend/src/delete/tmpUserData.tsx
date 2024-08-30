// pozniej przerobimy to na odpytanie api, na ten moment dane są tylko na potrzeby frontend'owe
export const data = {
    accountName: "Konto dla Młodych",
    accountNumber: "06102050401234600102316177",
    availableFunds: 123.56,
    balance: 99.12,
    blockades: 44.00,
    currency: "PLN"
};

export const availableFunds = data.availableFunds.toFixed(2);
export const balance = data.balance.toFixed(2);
export const blockades = data.blockades.toFixed(2);
//