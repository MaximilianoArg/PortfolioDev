export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: 'INGRESO' | 'GASTO';
    is_default: boolean;
    parent_category?: number;
    subcategories?: Category[];
    created_at?: string;
}

export interface Budget {
    id: number;
    category: number;
    category_name: string;
    category_icon: string;
    category_color: string;
    amount: number;
    month: string;
    account?: number;
    account_name?: string;
    spent: number;
    percentage: number;
    created_at?: string;
}
