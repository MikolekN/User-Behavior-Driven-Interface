import React from 'react';
import { Link } from 'react-router-dom';
import Tile from '../Tile/Tile';
import './AccountDetailsTile.css';
import Button from '../utils/Button';

import { data, availableFunds, balance, blockades } from "../../delete/tmpUserData"; // to delete just tmp solution

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
                    <Link to="/transfer">
                        <Button>Transfer</Button>
                    </Link>
                </div>
            </div>
        </div>
    </Tile>
  )
}

export default AccountDetailsTile;
