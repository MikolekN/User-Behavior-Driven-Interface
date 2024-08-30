import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tile from '../components/Tile/Tile.tsx';

import { data, availableFunds } from "../delete/tmpUserData"; // to delete just tmp solution

interface TransferFromData {
    recipentAccountNumber: string;
    transferTitle: string;
    amount: string;
}

const Transfer = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<TransferFromData>({
        defaultValues: {
          recipentAccountNumber: "",
          transferTitle: "",
          amount: "" // regex dla stringa, który ma ileś tam liczb z przodu i 2 po przecinku lub kropce "/^\d{1,}([.,]?\d{0,2})?$/"
        },
        mode: 'onSubmit'
    });
    
    //const { setIsLoggedIn, setUsername }: AuthContext = useOutletContext(); 
    const navigate = useNavigate();
    const [ apiError, setApiError ] = useState({isError: false, errorMessage: ""});
    
    const onSubmit = handleSubmit(async ({ recipentAccountNumber, transferTitle, amount }: TransferFromData) => {

        // separate function maybe
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = String(today.getFullYear());

        const currentDate = mm + '/' + dd + '/' + yyyy;


        const requestData = {
            fromAccountNumber: data.accountNumber,
            recipentAccountNumber: recipentAccountNumber,
            transferTitle: transferTitle,
            amount: amount,
            transferDate: currentDate
        }

        // finish logic when backend will be ready
        console.log(requestData);
    });

    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                    <div className="text-center font-semibold text-2xl mb-6 text-gray-700">Transfer</div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block">From account</label>
                        <div className="w-full p-3 mb-6 border border-gray-300 rounded-lg mt-1 bg-gray-300">
                            <p>
                                {data.accountName} {`(${availableFunds} PLN)`}
                            </p>
                            <p>
                                {data.accountNumber}
                            </p>
                        </div>
                    </div>
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block">Recipent account number</label>
                            <input
                            {...register('recipentAccountNumber', {
                                required: 'Recipent account number is required',
                                pattern: {
                                    value: /^\d{26}$/,
                                    message: 'Invalid account number'
                                }
                            })}
                                style={{ borderColor: errors.recipentAccountNumber ? 'red' : '' }}
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.recipentAccountNumber && <p className="text-red-600 mt-1 text-sm">{errors.recipentAccountNumber.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block">Title</label>
                            <input
                            {...register('transferTitle', { required: 'Title is required' })}
                                style={{borderColor: errors.transferTitle ? "red": ""}}
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.transferTitle && <p className="text-red-600 mt-1 text-sm">{errors.transferTitle.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block">Amount</label>
                            <input
                            {...register('amount', { 
                                    required: 'Amount is required',
                                    pattern: {
                                        value: /^\d{1,}([.,]?\d{0,2})?$/,
                                        message: 'Invalid amount format'
                                    } 
                                })}
                                style={{borderColor: errors.amount ? "red": ""}}
                                type="text"
                                placeholder="0.00"
                                className="w-10/12 p-3 border border-gray-300 rounded-lg mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            /> 
                            <span className="p-3 bg-gray-300 text-gray-700 border border-gray-300 border-l-0 rounded-lg mt-1 ml-1">
                                PLN
                            </span>
                            {errors.amount && <p className="text-red-600 mt-1 text-sm">{errors.amount.message}</p>}
                        </div>
                        <div>
                            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
                        </div>
                        <div>
                            {apiError.isError && <p className="text-red-600 mt-1 text-sm">{apiError.errorMessage}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Transfer;