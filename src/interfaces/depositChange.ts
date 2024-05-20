import { DepositChangeFrequency } from "~/enums/frequencies.ts";

export interface DepositChange {
    id: number;
    amount: number;
    frequency: DepositChangeFrequency;
    date: Date;
}
