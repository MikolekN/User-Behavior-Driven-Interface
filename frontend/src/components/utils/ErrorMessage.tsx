interface ErrorMessageProps {
    message: string | undefined;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <p className="text-red-600 mt-1 text-sm">{message}</p>
    );
};

export default ErrorMessage;