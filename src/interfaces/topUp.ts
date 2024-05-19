import { TopUpFrequency } from "~/enums/paymentFrequency.ts";

export interface TopUp {
    amount: number;
    frequency: TopUpFrequency;
    date: Date;
}
