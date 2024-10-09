import { ReactNode } from 'react';
import Tile from '../Tile/Tile';
import { Alert, AlertTitle } from '@mui/material';

interface EmptyResponseInfoAlertProps {
    title: string;
    alertTitle: string;
    alertMessage: string;
	children?: ReactNode;
}

const EmptyResponseInfoAlert = ({ title, alertTitle, alertMessage, children }: EmptyResponseInfoAlertProps) => {
    return (
        <Tile title={title} className="table-tile">
            <div className="grid p-8">
                {children}
                <Alert severity="info" variant="outlined">
                    <AlertTitle>
                        {alertTitle}
                    </AlertTitle>
                    It looks like you haven't made any {alertMessage}. Once you add one, it will appear here for you to review.
                </Alert>
            </div>
        </Tile>
    );
};

export default EmptyResponseInfoAlert;