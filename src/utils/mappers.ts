import { DepositChangeFrequency, PaymentFrequency } from "~/enums/frequencies.ts";
import { PeriodType } from "~/enums/period.ts";

export const mapPaymentFrequency = (paymentFrequency: PaymentFrequency): string => {
    const map: Record<PaymentFrequency, string> = {
        [PaymentFrequency.DAILY]: "Ежедневно",
        [PaymentFrequency.WEEKLY]: "Еженедельно",
        [PaymentFrequency.MONTHLY]: "Ежемесячно",
        [PaymentFrequency.YEARLY]: "Ежегодно",
        [PaymentFrequency.ONE_TIME]: "В конце срока",
    };
    return map[paymentFrequency];
};

export const mapPeriodType = (periodType: PeriodType): string => {
    const map: Record<PeriodType, string> = {
        [PeriodType.DAY]: "дней",
        [PeriodType.MONTH]: "месяцев",
        [PeriodType.YEAR]: "лет",
        [PeriodType.HALF_YEAR]: "полгода",
        [PeriodType.ONE_YEAR]: "год",
        [PeriodType.TWO_YEAR]: "2 года",
        [PeriodType.THREE_YEAR]: "3 года",
    };
    return map[periodType];
};

export const mapDepositChangeFrequency = (depositChangeFrequency: DepositChangeFrequency): string => {
    const map: Record<DepositChangeFrequency, string> = {
        [DepositChangeFrequency.ONE_TIME]: "Единовременно",
        [DepositChangeFrequency.ONCE_A_MONTH]: "Раз в месяц",
        [DepositChangeFrequency.ONCE_A_HALF_YEAR]: "Раз в полгода",
        [DepositChangeFrequency.ONCE_A_YEAR]: "Раз в год",
    };
    return map[depositChangeFrequency];
};
