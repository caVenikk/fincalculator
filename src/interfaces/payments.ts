export interface Payment {
    date: Date;
    accruedAmount: number;
    balance: number;
}

export interface Summary {
    totalAccrued: number;
    finalBalance: number;
}

export interface CalculationResult {
    payments: Payment[];
    summary: Summary;
}
