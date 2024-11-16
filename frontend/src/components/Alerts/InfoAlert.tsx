import { HiInformationCircle } from 'react-icons/hi';

interface AlertProps {
    alertTitle: string;
    alertMessage: string;
}

const InfoAlert = ({alertTitle, alertMessage}: AlertProps) => {
    return (
        <div id="info-alert" className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
            <div className="flex items-center">
                <HiInformationCircle />
                <h3 className="text-lg font-medium ml-2">{alertTitle}</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
                <p>It looks like you haven&apos;t made any {alertMessage}. Once you add one, it will appear here for you to review.</p>
            </div>
        </div>
    )
};

export default InfoAlert;
