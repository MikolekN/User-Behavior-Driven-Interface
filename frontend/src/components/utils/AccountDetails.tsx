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
            <div className={`${className} border border-gray-300 rounded-lg mt-1 bg-gray-200`} >
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
