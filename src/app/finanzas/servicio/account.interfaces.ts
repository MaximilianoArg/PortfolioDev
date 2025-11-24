export interface Credit {
    id?: number;
    name: string;
    total_amount: number;
    remaining_amount: number;
    next_payment_date?: string;
    next_payment_amount?: number;
    interest_rate?: number;
    total_installments?: number;
    installments_paid?: number;
    is_paid: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Account {
    id?: number;
    name: string;
    balance: number;
    currency: string;
    tna?: number;
    bank_name?: string;
    bank_image?: string;
    cbu_cvu?: string;
    credits?: Credit[];
    created_at?: string;
    updated_at?: string;
}
