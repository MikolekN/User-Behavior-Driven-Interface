import { createContext, ReactNode, useMemo, useCallback, useState } from 'react';
import { createCyclicPaymentData, deleteCyclicPaymentData, getCyclicPaymentData, getCyclicPaymentsData, updateCyclicPaymentData } from '../services/cyclicPaymentService';
import { BackendCyclicPayment, CyclicPayment, mapBackendCyclicPaymentToCyclicPayment } from '../components/utils/types/CyclicPayment';

interface CyclicPaymentContextProps {
    cyclicPayment: CyclicPayment | null;
    setCyclicPayment: React.Dispatch<React.SetStateAction<CyclicPayment | null>>;
    cyclicPayments: CyclicPayment[] | null;
    setCyclicPayments: React.Dispatch<React.SetStateAction<CyclicPayment[]>>;
    createCyclicPayment: (requestBody: object) => Promise<void>;
    getCyclicPayment: (id: string) => Promise<void>;
    deleteCyclicPayment: (id: string) => Promise<void>;
    updateCyclicPayment: (id: string, requestBody: object) => Promise<void>;
    getCyclicPayments: () => Promise<void>;
}

const defaultContextValue: CyclicPaymentContextProps = {
    cyclicPayment: null,
    setCyclicPayment: () => {},
    cyclicPayments: null,
    setCyclicPayments: () => {},
    createCyclicPayment: async () => {},
    getCyclicPayment: async () => {},
    deleteCyclicPayment: async () => {},
    updateCyclicPayment: async () => {},
    getCyclicPayments: async () => {}
};

export const CyclicPaymentContext = createContext<CyclicPaymentContextProps>(defaultContextValue);

// eslint-disable-next-line react/prop-types
export const CyclicPaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cyclicPayment, setCyclicPayment] = useState<CyclicPayment | null>(null);
    const [cyclicPayments, setCyclicPayments] = useState<CyclicPayment[]>([]);

    const createCyclicPayment = useCallback(async (requestBody: object): Promise<void> => {
        try {
            await createCyclicPaymentData(requestBody);
        } catch (error) {
            console.error('Error during Cyclic Payment:', error);
            throw error;
        }
    }, []);

    const getCyclicPayment = useCallback(async (id: string): Promise<void> => {
        try {
            const { cyclic_payment: backendCyclicPaymentData } = await getCyclicPaymentData(id);
            const cyclicPaymentFrontendData = mapBackendCyclicPaymentToCyclicPayment(backendCyclicPaymentData);
            setCyclicPayment(cyclicPaymentFrontendData);
        } catch (error) {
            console.error('Error during Cyclic Payment:', error);
            throw error;
        }
    }, []);

    const deleteCyclicPayment = useCallback(async (id: string): Promise<void> => {
        try {
            await deleteCyclicPaymentData(id);
        } catch (error) {
            console.error('Error during Cyclic Payment:', error);
            throw error;
        }
    }, []);

    const updateCyclicPayment = useCallback(async (id: string, requestBody: object): Promise<void> => {
        try {
            await updateCyclicPaymentData(id, requestBody);
        } catch (error) {
            console.error('Error during Cyclic Payment:', error);
            throw error;
        }
    }, []);

    const getCyclicPayments = useCallback(async (): Promise<void> => {
        try {
            const { cyclic_payments: backendCyclicPaymentsData } = await getCyclicPaymentsData();
            const formattedCyclicPayments: CyclicPayment[] = [];
            backendCyclicPaymentsData.forEach((backendCyclicPaymentData: BackendCyclicPayment) => {
                const cyclicPaymentFrontendData = mapBackendCyclicPaymentToCyclicPayment(backendCyclicPaymentData);
                formattedCyclicPayments.push(cyclicPaymentFrontendData);
            });
            setCyclicPayments(formattedCyclicPayments);
        } catch (error) {
            console.error('Error during Cyclic Payment:', error);
            throw error;
        }
    }, []);

    const CyclicPaymentContextValue = useMemo(() => ({
        cyclicPayment,
        setCyclicPayment,
        cyclicPayments,
        setCyclicPayments,
        createCyclicPayment,
        getCyclicPayment,
        deleteCyclicPayment,
        updateCyclicPayment,
        getCyclicPayments
    }), [cyclicPayment, setCyclicPayment, cyclicPayments, setCyclicPayments, 
        createCyclicPayment, getCyclicPayment, deleteCyclicPayment,
        updateCyclicPayment, getCyclicPayments]);

    return (
        <CyclicPaymentContext.Provider value={CyclicPaymentContextValue}>
            {children}
        </CyclicPaymentContext.Provider>
    );
};
