import Label from './Label';
import { Account } from './types/Account';

interface AccountDetailsProps {
    label: string;
    account: Account;
    className?: string;
}

const AccountDetails = ({ label, account, className = '' }: AccountDetailsProps) => {
    return (
        <div className="my-4">
            <Label label={label} />
            <div className={`${className} text-gray-700 dark:text-gray-400 bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-sm md:text-base`} >
                <p>
                    {account.accountName} {`(${account.availableFunds} ${account.currency})`}
                </p>
                <p>
                    {account.accountNumber}
                </p>
            </div>
        </div>
    )
};

export default AccountDetails;
