import { PaymentFrequency } from "~/enums/frequencies.ts";
import { DepositChange } from "~/interfaces/depositChange.ts";

export interface CalculatorForm {
    amount: number;
    rate: number;
    paymentFrequency: PaymentFrequency;
    openDate: Date;
    closeDate: Date;
    isTopUps: boolean;
    topUps: DepositChange[];
    isWithdraws: boolean;
    withdraws: DepositChange[];
}
