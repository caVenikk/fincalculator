import { PaymentFrequency } from "~/enums/paymentFrequency.ts";
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
