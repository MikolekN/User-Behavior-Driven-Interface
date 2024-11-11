export interface CyclicPayment {
    id: string | null;
    amount: number;
    cyclicPaymentName: string;
    interval: string;
    recipientAccountNumber: string;
    recipientName: string;
    startDate: Date | null;
    transferTitle: string;
}

export interface BackendCyclicPayment {
    _id: string | null;
    amount: number;
    cyclic_payment_name: string;
    interval: string;
    recipient_account_number: string;
    recipient_name: string;
    start_date: string;
    transfer_title: string;
}

export const mapBackendCyclicPaymentToCyclicPayment = (backendCyclicPaymentData: BackendCyclicPayment): CyclicPayment => {
    return {
        id: backendCyclicPaymentData._id,
        amount: backendCyclicPaymentData.amount,
        cyclicPaymentName: backendCyclicPaymentData.cyclic_payment_name,
        interval: backendCyclicPaymentData.interval,
        recipientAccountNumber: backendCyclicPaymentData.recipient_account_number,
        recipientName: backendCyclicPaymentData.recipient_name,
        transferTitle: backendCyclicPaymentData.transfer_title,
        startDate: backendCyclicPaymentData.start_date ? new Date(backendCyclicPaymentData.start_date) : null,
    };
};

export const mapBackendCyclicPaymentsListToCyclicPayment = (backendCyclicPaymentsData: BackendCyclicPayment[]): CyclicPayment[] => {
    const formattedCyclicPayments: CyclicPayment[] = [];
    backendCyclicPaymentsData.forEach((backendCyclicPaymentData: BackendCyclicPayment) => {
        const cyclicPaymentFrontendData = mapBackendCyclicPaymentToCyclicPayment(backendCyclicPaymentData);
        formattedCyclicPayments.push(cyclicPaymentFrontendData);
    });
    return formattedCyclicPayments;
}