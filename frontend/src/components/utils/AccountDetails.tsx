import Label from './Label';
import { User } from './User';

interface AccountDetailsProps {
    label: string;
    user: User;
    className?: string;
}

const AccountDetails = ({ label, user, className = '' }: AccountDetailsProps) => {
    return (
        <div className="my-4">
            <Label label={label} />
            <div className={`${className} text-gray-700 dark:text-gray-400 bg-gray-300 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg`} >
                <p>
                    {user.accountName} {`(${user.availableFunds} ${user.currency})`}
                </p>
                <p>
                    {user.accountNumber}
                </p>
            </div>
        </div>
    )
};

export default AccountDetails;
