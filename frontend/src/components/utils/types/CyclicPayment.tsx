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
    start_date: Date | null;
    transfer_title: string;
}