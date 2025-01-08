import { Account } from '../utils/types/Account';
import { Link } from 'react-router-dom';
import Button from '../utils/Button';
import { useTranslation } from 'react-i18next';
import CollapsibleTable from '../CollapsibleTable/CollapsibleTable';
import { useState } from 'react';
import Label from '../utils/Label';

interface AccountsListProps {
    accounts: Account[];
}

const AccountsList = ({ accounts }: AccountsListProps) => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleDelete = (id: string) => {
        console.log("delete account with id: ", id);
    }

    return (
        <div>
            <Link to={'/create-account/'} className="pr-12 pb-4">
                <div className="grid">
                    <Button className="justify-self-end mb-2">+ {t('accountList.submit')}</Button>
                </div>
            </Link>
            <CollapsibleTable
                headers={[
                    t('accountList.name'),
                    t('accountList.number'),
                    t('accountList.balance')
                ]}
                rows={accounts}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                renderRow={(account, activeIndex, hovering, idx) => (
                    <>
                        <td className={`px-4 py-2 text-center font-bold rounded-tl ${activeIndex !== idx ? 'rounded-bl' : ''} ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:text-gray-300`}>
                            {account.name}
                        </td>
                        <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:text-gray-300`}>{account.number}</td>
                        <td className={`px-4 py-2 text-center  ${hovering === idx && activeIndex !== idx ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:text-gray-300`}>{account.balance}</td>
                    </>
                )}
                renderRowDetails={(account) => (
                    <div className="flex flex-col items-center space-y-4 p-4 mt-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <div className="flex w-full justify-evenly">
                            <div>
                                <div className="mb-4">
                                    <Label label={t('accountList.ownerId')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{account.ownerId}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('accountList.availableFunds')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{account.availableFunds}</i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <Label label={t('accountList.iban')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{account.iban}</i>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <Label label={t('accountList.openDate')}/>
                                    <div className="pl-4 dark:text-gray-300">
                                        <i>{new Date(account.openDate).toLocaleDateString()}</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 w-full">
                            <Link to={`/edit-cyclic-payment/${account.id}`} className="w-1/6">
                                <Button className="w-full mt-1">
                                    {t('accountList.edit')}
                                </Button>
                            </Link>
                            <Button onClick={() => handleDelete(account.id!)} className="w-2/6 bg-green-600 hover:bg-green-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 mt-1 ml-10">
                                {t('accountList.setActive')}
                            </Button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default AccountsList;
