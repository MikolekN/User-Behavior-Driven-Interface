import React from 'react';
import Tile from '../Tile/Tile';
import './AccountDetailsTile.css';
import Button from '../utils/Button';

// pozniej przerobimy to na odpytanie api, na ten moment dane są tylko na potrzeby frontend'owe
const data = {
    accountName: "Konto dla Młodych",
    accountNumber: "06 1020 5040 1234 6001 0231 6177",
    availableFunds: 123.56,
    balance: 99.12,
    blockades: 44.00,
    currency: "PLN"
};

const availableFunds = data.availableFunds.toFixed(2);
const balance = data.balance.toFixed(2);
const blockades = data.blockades.toFixed(2);

const AccountDetailsTile = () => {
  return (
    <Tile title={data.accountName} className="account-details-tile">
        <div>
            <p>{data.accountNumber}</p>
        </div>
        <div className="flex justify-end space-x-4 ml-10">
            <div className="p-4">
                <p>Balance: {balance} {data.currency}</p>
                <p>Blockades: {blockades} {data.currency}</p>
            </div>
            <div className="grid p-4">
                <p className="border-l border-gray-500 pl-8">Available Funds: <br/> {availableFunds} {data.currency}</p>
                <div className="justify-self-end pt-4 pl-4">
                    <Button>Transfer</Button>
                </div>
            </div>
        </div>
    </Tile>
  )
}

export default AccountDetailsTile;
