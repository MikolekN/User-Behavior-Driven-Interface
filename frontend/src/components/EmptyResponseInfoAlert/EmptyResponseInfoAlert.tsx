import { ReactNode } from 'react';
import Tile from '../Tile/Tile';
import InfoAlert from '../Alerts/InfoAlert';


interface EmptyResponseInfoAlertProps {
    title: string;
    alertTitle: string;
    alertMessage: string;
    children?: ReactNode;
}

const EmptyResponseInfoAlert = ({ title, alertTitle, alertMessage, children }: EmptyResponseInfoAlertProps) => {
    return (
        <div className='flex overflow-hidden flex-col flex-grow justify-center items-center h-full max-h-full'>
            <Tile title={title}>
                <div className="grid p-8">
                    {children}
                    <InfoAlert alertTitle={alertTitle} alertMessage={alertMessage} />
                </div>
            </Tile>
        </div>
    );
};

export default EmptyResponseInfoAlert;