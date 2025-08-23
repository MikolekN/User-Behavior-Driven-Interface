import { Account } from '../utils/types/Account';
import { Link } from 'react-router-dom';
import Button from '../utils/Button';
import { useTranslation } from 'react-i18next';
import CollapsibleTable from '../CollapsibleTable/CollapsibleTable';
import { useContext, useEffect, useState } from 'react';
import Label from '../utils/Label';
import CollapsibleList from '../CollapsibleList/CollapsibleList';
import { UserContext } from '../../context/UserContext';
import { AccountContext } from '../../context/AccountContext';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import { FaCheck } from "react-icons/fa6";

interface AccountsListProps {
    accountsList: Account[];
}

const AccountsList = ({ accountsList }: AccountsListProps) => {
    const { t } = useTranslation();
    const { user, getUser } = useContext(UserContext);
    const { deleteAccount } = useContext(AccountContext);
    const { getActiveAccount, fetchActiveAccount } = useContext(AccountContext);
    const { handleError } = useApiErrorHandler();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccountId, setActiveAccountId] = useState<string | null>(null);

    const resetActiveIndex = () => {
        setActiveIndex(null);
    };

    useEffect(() => {
        const fetchActiveAccount = async () => {
            await getActiveAccount();
        }

        fetchActiveAccount();
        setAccounts(accountsList);
        setActiveAccountId(user!.activeAccount);
    }, [accountsList, getActiveAccount]);

    const handleSetActive = (accountNumber: string) => {
        const setActiveAccount = async () => {
            try {
                await fetchActiveAccount(accountNumber);
                await getUser();
            } catch (error) {
                handleError(error);
            }
        }

        setActiveAccount();
    };

    const handleDelete = (accountNumber: string) => {
        const deleteCyclicPaymentItem = async () => {
            try {
                await deleteAccount(accountNumber);
                resetActiveIndex();
                await getUser();
            } catch (error) {
                handleError(error);
            }
        };

        void deleteCyclicPaymentItem().then(() => {
            setAccounts(accounts => accounts.filter(x => x.accountNumber !== accountNumber));
        });
    };

    return (
        <div>
            <Link to={'/create-account/'} className="pr-12 pb-4">
                <div className="grid">
                    <Button className="justify-self-end mb-2 dark:bg-slate-900 dark:hover:bg-slate-800">+ {t('accountList.submit')}</Button>
                </div>
            </Link>
            <div className="hidden md:block">
                <CollapsibleTable
                    headers={[
                        '',
                        t('accountList.accountName'),
                        t('accountList.accountNumber'),
                        t('accountList.balance')
                    ]}
                    rows={accounts}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    renderRow={(account, activeIndex, hovering, idx) => (
                        <>
                            <td className={`px-4 py-2 text-center font-bold rounded-tl ${activeIndex !== idx ? 'rounded-bl' : ''} ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>
                                { activeAccountId === account.id && 
                                    <FaCheck />
                                }
                            </td>
                            <td className={`px-4 py-2 text-center ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>
                                {account.accountName}
                            </td>
                            <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>{account.accountNumber}</td>
                            <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'} dark:text-gray-300`}>{account.balance}</td>
                        </>
                    )}
                    renderRowDetails={(account) => (
                        <div className="flex flex-col items-center space-y-4 p-4 mt-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex w-full justify-evenly">
                                <div>
                                    <div className="mb-4">
                                        <Label label={t('accountList.blockades')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{account.blockades}</i>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Label label={t('accountList.balance')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{account.balance}</i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <Label label={t('accountList.currency')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{account.currency}</i>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <Label label={t('accountList.accountType')}/>
                                        <div className="pl-4 dark:text-gray-300">
                                            <i>{t(`accountTypes.${account.accountType}`)}</i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 w-full">
                                { activeAccountId !== account.id ?
                                    <Button onClick={() => handleSetActive(account.accountNumber)} className="w-2/6 bg-green-600 hover:bg-green-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 mt-1 ml-10">
                                        {t('accountList.setActive')}
                                    </Button> : <></>  
                                }
                                <Link to={`/edit-account/${account.accountNumber}`} className="w-1/6">
                                    <Button className="w-full mt-1 dark:bg-slate-900 dark:hover:bg-slate-800">
                                        {t('accountList.edit')}
                                    </Button>
                                </Link>
                                <Button onClick={() => handleDelete(account.accountNumber)} className="w-1/6 bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1 ml-10">
                                    {t('accountList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
            <div className="md:hidden">
                <CollapsibleList
                    items={accounts}
                    renderHeader={(account) => (
                        <>
                            { activeAccountId === account.id ? 
                                <FaCheck /> :
                                <span></span>
                            }
                            <span className="pl-2">{account.accountName}</span>
                        </>
                    )}
                    renderDetails={(account) => (
                        <div className="flex flex-col space-y-4">
                            <div>
                                <Label label={t('accountList.accountName')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{account.accountName}</i>
                                </div>
                            </div>
                            <div>
                                <Label label={t('accountList.accountNumber')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{account.accountNumber}</i>
                                </div>
                            </div>
                            <div>
                                <Label label={t('accountList.accountType')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{t(`accountTypes.${account.accountType}`)}</i>
                                </div>
                            </div>
                            <div>
                                <Label label={t('accountList.blockades')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{account.blockades}</i>
                                </div>
                            </div>
                            <div>
                                <Label label={t('accountList.balance')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{account.balance}</i>
                                </div>
                            </div>
                            <div>
                                <Label label={t('accountList.currency')} />
                                <div className="pl-4 dark:text-gray-300">
                                    <i>{account.currency}</i>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                { activeAccountId !== account.id ?
                                    <Button
                                        onClick={() => handleSetActive(account.accountNumber)}
                                        className="w-full bg-green-600 hover:bg-green-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 mt-1"
                                    >
                                        {t('accountList.setActive')}
                                    </Button> : <></>  
                                }
                                <Link to={`/edit-account/${account.accountNumber}`} className="w-full mt-1">
                                    <Button className="w-full dark:bg-slate-900 dark:hover:bg-slate-800">{t('accountList.edit')}</Button>
                                </Link>
                                <Button onClick={() => handleDelete(account.accountNumber)} className="w-full bg-red-600 hover:bg-red-700 dark:bg-rose-950 dark:hover:bg-rose-900 mt-1">
                                    {t('accountList.delete')}
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default AccountsList;
