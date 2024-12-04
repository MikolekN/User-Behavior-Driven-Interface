import { createContext, ReactNode, useMemo, useCallback, useState } from 'react';
import { createCyclicPaymentData, deleteCyclicPaymentData, getCyclicPaymentData, getCyclicPaymentsData, updateCyclicPaymentData } from '../services/cyclicPaymentService';
import { CyclicPayment, mapBackendCyclicPaymentsListToCyclicPayment, mapBackendCyclicPaymentToCyclicPayment } from '../components/utils/types/CyclicPayment';

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
        await createCyclicPaymentData(requestBody);
    }, []);

    const getCyclicPayment = useCallback(async (id: string): Promise<void> => {
        const { cyclic_payment: backendCyclicPaymentData } = await getCyclicPaymentData(id);
        if (backendCyclicPaymentData) {
            setCyclicPayment(mapBackendCyclicPaymentToCyclicPayment(backendCyclicPaymentData));
        }
    }, []);

    const deleteCyclicPayment = useCallback(async (id: string): Promise<void> => {
        await deleteCyclicPaymentData(id);
    }, []);

    const updateCyclicPayment = useCallback(async (id: string, requestBody: object): Promise<void> => {
        await updateCyclicPaymentData(id, requestBody);
    }, []);

    const getCyclicPayments = useCallback(async (): Promise<void> => {
        const { cyclic_payments: cyclicPaymentsBackendData } = await getCyclicPaymentsData();
        if (cyclicPaymentsBackendData) {
            setCyclicPayments(mapBackendCyclicPaymentsListToCyclicPayment(cyclicPaymentsBackendData));
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
