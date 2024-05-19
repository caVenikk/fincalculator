<script lang="ts" setup>
import { computed, ref } from "vue";
import { PaymentFrequency } from "~/enums/paymentFrequency.ts";
import { TopUp } from "~/interfaces/topUp.ts";
import { mapPaymentFrequency, mapPeriodType } from "~/utils/mappers.ts";
import { ru } from "date-fns/locale";
import TheInput from "~/components/ui/TheInput.vue";
import TheSelect from "~/components/ui/TheSelect.vue";
import { PeriodType } from "~/enums/period.ts";

const amount = ref<number>(0);

const rate = ref<number>(0);
const paymentFrequency = ref<PaymentFrequency>(PaymentFrequency.DAILY);

const paymentFrequencyOptions = computed<{ value: PaymentFrequency; label: string }[]>(() => {
    return Object.values(PaymentFrequency).map((frequency) => {
        return {
            value: frequency,
            label: mapPaymentFrequency(frequency),
        };
    });
});

const openDate = ref<Date>(new Date());
const tempDate = new Date(openDate.value);
tempDate.setDate(tempDate.getDate() + 1);
const closeDate = ref<Date>(tempDate);

const minimalCloseDate = computed<Date>(() => {
    const minimalCloseDate = new Date(openDate.value);
    minimalCloseDate.setDate(minimalCloseDate.getDate() + 1);
    return minimalCloseDate;
});

const inputtedPeriod = ref<number>(1);

const periodType = ref<PeriodType>(PeriodType.DAY);
const periodTypesWithNoInput = [PeriodType.HALF_YEAR, PeriodType.ONE_YEAR, PeriodType.TWO_YEAR, PeriodType.THREE_YEAR];

const periodTypeOptions = computed<{ value: PeriodType; label: string }[]>(() => {
    return Object.values(PeriodType).map((type) => {
        return {
            value: type,
            label: mapPeriodType(type),
        };
    });
});

const periodInputRules = [
    (v: string) => !!v || "Введите срок",
    (v: string) => parseInt(v) > 0 || "Срок должен быть больше 0",
];

const periodError = ref<string>("");

const isPeriodTypeWithNoInput = (periodType: PeriodType) => {
    return periodTypesWithNoInput.includes(periodType);
};

const calculateCloseDate = (startDate: Date, period: number, periodType: PeriodType): Date => {
    let newCloseDate = new Date(startDate);
    switch (periodType) {
        case PeriodType.DAY:
            newCloseDate.setDate(newCloseDate.getDate() + period);
            break;
        case PeriodType.MONTH:
            newCloseDate.setMonth(newCloseDate.getMonth() + period);
            break;
        case PeriodType.YEAR:
            newCloseDate.setFullYear(newCloseDate.getFullYear() + period);
            break;
        case PeriodType.HALF_YEAR:
            newCloseDate.setMonth(newCloseDate.getMonth() + 6);
            break;
        case PeriodType.ONE_YEAR:
            newCloseDate.setFullYear(newCloseDate.getFullYear() + 1);
            break;
        case PeriodType.TWO_YEAR:
            newCloseDate.setFullYear(newCloseDate.getFullYear() + 2);
            break;
        case PeriodType.THREE_YEAR:
            newCloseDate.setFullYear(newCloseDate.getFullYear() + 3);
            break;
        default:
            break;
    }
    return newCloseDate;
};

const calculatePeriod = (startDate: Date, closeDate: Date, periodType: PeriodType): number => {
    switch (periodType) {
        case PeriodType.DAY:
            return Math.round((closeDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
        case PeriodType.MONTH:
            return Math.round((closeDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 / 30);
        case PeriodType.YEAR:
            return Math.round((closeDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24 / 365);
        default:
            return 0;
    }
};

const updatePeriod = () => {
    periodType.value = PeriodType.DAY;

    if (openDate.value > closeDate.value) {
        const tempDate = new Date(openDate.value);
        tempDate.setDate(tempDate.getDate() + inputtedPeriod.value);
        closeDate.value = tempDate;
    } else {
        inputtedPeriod.value = calculatePeriod(openDate.value, closeDate.value, periodType.value);
    }
};

const updateCloseDate = () => {
    closeDate.value = calculateCloseDate(openDate.value, inputtedPeriod.value, periodType.value);
};

const isTopUps = ref<boolean>(false);
const topUps = ref<TopUp[]>([]);

const isWithdraws = ref<boolean>(false);
const withdraws = ref<TopUp[]>([]);
</script>

<template>
    <form>
        <div class="calculator-form">
            <TheInput v-model.number="amount" label="Сумма" type="number" uid="initialAmount" />

            <TheInput v-model.number="rate" label="Ставка" type="number" uid="rate">
                <template #after> %</template>
            </TheInput>

            <TheSelect v-model="paymentFrequency" :options="paymentFrequencyOptions" label="Периодичность выплат" />

            <div class="datepicker-wrapper">
                <label for="dp-input-openDate">Дата открытия</label>
                <VueDatePicker
                    v-model="openDate"
                    :auto-apply="true"
                    :enable-time-picker="false"
                    :format-locale="ru"
                    :required="true"
                    format="dd.MM.yyyy"
                    locale="ru"
                    uid="openDate"
                    @update:model-value="updatePeriod"
                >
                </VueDatePicker>
            </div>

            <div class="period-picker-wrapper">
                <div class="period-picker">
                    <label for="period">Срок</label>
                    <TheInput
                        v-if="!isPeriodTypeWithNoInput(periodType)"
                        v-model.number="inputtedPeriod"
                        v-model:error-message="periodError"
                        :no-error="true"
                        :rules="periodInputRules"
                        type="number"
                        uid="period"
                        @update:model-value="updateCloseDate"
                    />
                    <TheSelect
                        v-model="periodType"
                        :options="periodTypeOptions"
                        @update:model-value="updateCloseDate"
                    />
                </div>
                <TransitionGroup name="error" tag="div">
                    <div v-if="periodError" class="error-message">{{ periodError }}</div>
                </TransitionGroup>
            </div>

            <div class="datepicker-wrapper">
                <label for="dp-input-closeDate">Дата закрытия</label>
                <VueDatePicker
                    v-model="closeDate"
                    :auto-apply="true"
                    :enable-time-picker="false"
                    :format-locale="ru"
                    :min-date="minimalCloseDate"
                    :required="true"
                    format="dd.MM.yyyy"
                    locale="ru"
                    uid="closeDate"
                    @update:model-value="updatePeriod"
                >
                </VueDatePicker>
            </div>

            <div>
                <TheInput v-model="isTopUps" label="Пополнения" type="checkbox" />
            </div>

            <!--        <div>-->
            <!--            <label for="isTopUp">Пополнения</label>-->
            <!--            <input id="isTopUp" type="checkbox" v-model="isTopUp" />-->
            <!--        </div>-->
            <!--        <div v-if="isTopUp">-->
            <!--            <div v-for="(topUp, index) in topUps" :key="index">-->
            <!--                <label for="topUpAmount">Сумма пополнения</label>-->
            <!--                <input id="topUpAmount" type="number" v-model="topUp.amount" />-->
            <!--                <label for="topUpDate">Дата пополнения</label>-->
            <!--                <input id="topUpDate" type="date" v-model="topUp.date" />-->
            <!--            </div>-->
            <!--            <button @click="topUps.push({ amount: 0, date: new Date() })">Добавить пополнение</button>-->
            <!--        </div>-->
            <!--        <div>-->
            <!--            <label for="isWithdraw">Снятия</label>-->
            <!--            <input id="isWithdraw" type="checkbox" v-model="isWithdraw" />-->
            <!--        </div>-->
            <!--        <div v-if="isWithdraw">-->
            <!--            <div v-for="(withdraw, index) in withdraws" :key="index">-->
            <!--                <label for="withdrawAmount">Сумма снятия</label>-->
            <!--                <input id="withdrawAmount" type="number" v-model="withdraw.amount" />-->
            <!--                <label for="withdrawDate">Дата снятия</label>-->
            <!--                <input id="withdrawDate" type="date" v-model="withdraw.date" />-->
            <!--            </div>-->
            <!--            <button @click="withdraws.push({ amount: 0, date: new Date() })">Добавить снятие</button>-->
            <!--        </div>-->
            <!--        <div>-->
            <!--            <label for="period">Период</label>-->
            <!--            <input id="period" type="number" :value="period" readonly />-->
            <!--        </div>-->
        </div>
    </form>
</template>

<style lang="scss" scoped>
.calculator-form {
    display: flex;
    flex-direction: column;
    width: 600px;
    margin-top: 20px;

    & > *:not(:last-child) {
        margin-bottom: 20px;
    }
}

.datepicker-wrapper {
    display: flex;
    flex-direction: row;
}

.period-picker-wrapper {
    display: flex;
    flex-direction: column;
}

.period-picker {
    display: flex;
    flex-direction: row;
    align-items: center;

    & > *:not(:last-child) {
        margin-right: 20px;
    }
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: 4px;
}

.error-enter-active,
.error-leave-active {
    transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
