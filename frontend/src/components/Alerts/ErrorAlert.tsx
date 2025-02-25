import { MdError } from "react-icons/md";

interface AlertProps {
    alertMessage: string;
}

const ErrorAlert = ({ alertMessage }: AlertProps) => {
    return (
        <div id="error-alert" className="my-4 p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
            <div className="flex items-center">
                <MdError />
                <div className="text-red-600 dark:text-red-300 ml-2">
                    <p>{alertMessage}</p>
                </div>
            </div>
        </div>
    )
};

export default ErrorAlert;
