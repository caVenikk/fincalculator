import { CalculatorForm } from "~/interfaces/form.ts";
import { CalculationResult, Payment } from "~/interfaces/payments.ts";
import { DepositChangeFrequency, PaymentFrequency } from "~/enums/frequencies.ts";

export const calculateProfit = (data: CalculatorForm): CalculationResult => {
    const { amount, rate, paymentFrequency, openDate, closeDate, isTopUps, topUps, isWithdraws, withdraws } = data;
    let balance = parseFloat(amount.toFixed(2));
    let totalAccrued = 0;
    const payments: Payment[] = [];

    const rateDaily = rate / 100 / 365;
    const days = (closeDate.getTime() - openDate.getTime()) / (1000 * 3600 * 24);

    const topUpsMap = new Map<string, number>();
    const withdrawsMap = new Map<string, number>();

    if (isTopUps) {
        topUps.forEach((topUp) => {
            if (topUp.frequency === DepositChangeFrequency.ONE_TIME) {
                topUpsMap.set(topUp.date.toISOString().split("T")[0], topUp.amount);
            }
        });
    }

    if (isWithdraws) {
        withdraws.forEach((withdraw) => {
            if (withdraw.frequency === DepositChangeFrequency.ONE_TIME) {
                withdrawsMap.set(withdraw.date.toISOString().split("T")[0], withdraw.amount);
            }
        });
    }

    let currentDate = new Date(openDate);

    for (let i = 0; i <= days; i++) {
        const dateString = currentDate.toISOString().split("T")[0];

        if (topUpsMap.has(dateString)) {
            balance += topUpsMap.get(dateString) || 0;
        }

        if (withdrawsMap.has(dateString)) {
            balance -= withdrawsMap.get(dateString) || 0;
        }

        const accruedAmount = parseFloat((balance * rateDaily).toFixed(2));
        balance += accruedAmount;
        balance = parseFloat(balance.toFixed(2));
        totalAccrued += accruedAmount;
        totalAccrued = parseFloat(totalAccrued.toFixed(2));

        if (
            paymentFrequency === PaymentFrequency.DAILY ||
            (paymentFrequency === PaymentFrequency.WEEKLY && currentDate.getDay() === 0) ||
            (paymentFrequency === PaymentFrequency.MONTHLY && currentDate.getDate() === 1) ||
            (paymentFrequency === PaymentFrequency.YEARLY &&
                currentDate.getDate() === 1 &&
                currentDate.getMonth() === 0) ||
            (paymentFrequency === PaymentFrequency.ONE_TIME && currentDate.getTime() === closeDate.getTime())
        ) {
            payments.push({ date: new Date(currentDate), accruedAmount, balance });
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        payments,
        summary: {
            totalAccrued: parseFloat(totalAccrued.toFixed(2)),
            finalBalance: parseFloat(balance.toFixed(2)),
        },
    };
};
