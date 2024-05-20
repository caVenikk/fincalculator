<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { DepositChangeFrequency, PaymentFrequency } from "~/enums/frequencies.ts";
import { DepositChange } from "~/interfaces/depositChange.ts";
import { mapPaymentFrequency, mapPeriodType } from "~/utils/mappers.ts";
import { ru } from "date-fns/locale";
import TheInput from "~/components/ui/TheInput.vue";
import TheSelect from "~/components/ui/TheSelect.vue";
import { PeriodType } from "~/enums/period.ts";
import TheDepositChange from "~/components/TheDepositChange.vue";
import TheButton from "~/components/ui/TheButton.vue";
import TheDivider from "~/components/ui/TheDivider.vue";
import { CalculatorForm } from "~/interfaces/form.ts";
import { CalculationResult } from "~/interfaces/payments.ts";
import { calculateProfit } from "~/utils/calculator.ts";
import TheCalculationsResult from "~/components/TheCalculationsResult.vue";

const openDate = new Date();
const closeDate = new Date(openDate);
closeDate.setDate(closeDate.getDate() + 1);

const form = ref<CalculatorForm>({
    amount: 0,
    rate: 0,
    paymentFrequency: PaymentFrequency.DAILY,
    openDate: openDate,
    closeDate: closeDate,
    isTopUps: false,
    topUps: [],
    isWithdraws: false,
    withdraws: [],
});

const paymentFrequencyOptions = computed<{ value: PaymentFrequency; label: string }[]>(() => {
    return Object.values(PaymentFrequency).map((frequency) => {
        return {
            value: frequency,
            label: mapPaymentFrequency(frequency),
        };
    });
});

const minimalCloseDate = computed<Date>(() => {
    const minimalCloseDate = new Date(form.value.openDate);
    minimalCloseDate.setDate(minimalCloseDate.getDate() + 1);
    return minimalCloseDate;
});

const period = ref<number>(1);
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

    if (form.value.openDate > form.value.closeDate) {
        const tempDate = new Date(form.value.openDate);
        tempDate.setDate(tempDate.getDate() + period.value);
        form.value.closeDate = tempDate;
    } else {
        period.value = calculatePeriod(form.value.openDate, form.value.closeDate, periodType.value);
    }
};

const updateCloseDate = () => {
    form.value.closeDate = calculateCloseDate(form.value.openDate, period.value, periodType.value);
};

const topUpsCounter = ref<number>(0);

watch(
    () => form.value.isTopUps,
    (newValue: boolean, oldValue: boolean) => {
        if (!oldValue && newValue && form.value.topUps.length === 0) {
            addTopUp();
        }
    }
);

const addTopUp = () => {
    form.value.topUps.push({
        id: topUpsCounter.value++,
        amount: 0,
        frequency: DepositChangeFrequency.ONE_TIME,
        date: new Date(),
    });
};

const removeTopUp = (id: number) => {
    form.value.topUps = form.value.topUps.filter((topUp) => topUp.id !== id);
};

const updateTopUp = (id: number, value: DepositChange) => {
    form.value.topUps = form.value.topUps.map((topUp) => (topUp.id === id ? value : topUp));
};

const withdrawsCounter = ref<number>(0);

watch(
    () => form.value.isWithdraws,
    (newValue: boolean, oldValue: boolean) => {
        if (!oldValue && newValue && form.value.withdraws.length === 0) {
            addWithdraw();
        }
    }
);

const addWithdraw = () => {
    form.value.withdraws.push({
        id: withdrawsCounter.value++,
        amount: 0,
        frequency: DepositChangeFrequency.ONE_TIME,
        date: new Date(),
    });
};

const removeWithdraw = (id: number) => {
    form.value.withdraws = form.value.withdraws.filter((withdraw) => withdraw.id !== id);
};

const updateWithdraw = (id: number, value: DepositChange) => {
    form.value.withdraws = form.value.withdraws.map((withdraw) => (withdraw.id === id ? value : withdraw));
};

const calculationResult = ref<CalculationResult>();

const calculate = () => {
    calculationResult.value = calculateProfit(form.value);
};
</script>

<template>
    <form>
        <div class="calculator-form">
            <TheInput v-model.number="form.amount" label="Сумма" type="number" uid="initialAmount">
                <template #after> ₽</template>
            </TheInput>

            <TheInput v-model.number="form.rate" label="Ставка" type="number" uid="rate">
                <template #after> %</template>
            </TheInput>

            <TheSelect
                v-model="form.paymentFrequency"
                :options="paymentFrequencyOptions"
                label="Периодичность выплат"
            />

            <div class="datepicker-wrapper">
                <label class="datepicker-label" for="dp-input-openDate">Дата открытия</label>
                <VueDatePicker
                    v-model="form.openDate"
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
                        v-model.number="period"
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
                <label class="datepicker-label" for="dp-input-closeDate">Дата закрытия</label>
                <VueDatePicker
                    v-model="form.closeDate"
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

            <div class="top-ups-wrapper">
                <TheInput v-model="form.isTopUps" label="Пополнения" type="checkbox" />
                <div class="top-ups" v-if="form.isTopUps">
                    <TransitionGroup name="deposit-change" tag="div" class="top-ups" v-if="form.isTopUps">
                        <div v-for="(topUp, index) in form.topUps" :key="topUp.id">
                            <div class="top-up-wrapper">
                                <TheDepositChange
                                    :style="{ marginBottom: index !== form.topUps.length - 1 ? '10px' : '0' }"
                                    :uid="index.toString()"
                                    :modelValue="topUp"
                                    :min-date="form.openDate"
                                    :max-date="form.closeDate"
                                    @update:modelValue="updateTopUp(topUp.id, $event)"
                                />
                                <TheButton @click.prevent="removeTopUp(topUp.id)" color="#ff0000" text-color="#fff">
                                    &#10005;
                                </TheButton>
                            </div>
                            <TheDivider
                                v-if="form.topUps.length > 1 && index !== form.topUps.length - 1"
                                :style="{ marginBottom: index !== form.topUps.length ? '10px' : '0' }"
                            />
                        </div>
                    </TransitionGroup>
                </div>
                <TheButton v-if="form.isTopUps" @click.prevent="addTopUp()" color="#088500" text-color="#fff">
                    Добавить пополнение
                </TheButton>
            </div>

            <div class="withdraws-wrapper">
                <TheInput v-model="form.isWithdraws" label="Частичные снятия" type="checkbox" />
                <div class="withdraws" v-if="form.isWithdraws">
                    <TransitionGroup name="deposit-change" tag="div" class="withdraws" v-if="form.isWithdraws">
                        <div v-for="(withdraw, index) in form.withdraws" :key="withdraw.id">
                            <div class="withdraw-wrapper">
                                <TheDepositChange
                                    :style="{ marginBottom: index !== form.withdraws.length - 1 ? '10px' : '0' }"
                                    :uid="index.toString()"
                                    :modelValue="withdraw"
                                    :min-date="form.openDate"
                                    :max-date="form.closeDate"
                                    @update:modelValue="updateWithdraw(withdraw.id, $event)"
                                />
                                <TheButton
                                    @click.prevent="removeWithdraw(withdraw.id)"
                                    color="#ff0000"
                                    text-color="#fff"
                                >
                                    &#10005;
                                </TheButton>
                            </div>
                            <TheDivider
                                v-if="form.withdraws.length > 1 && index !== form.withdraws.length - 1"
                                :style="{ marginBottom: index !== form.withdraws.length ? '10px' : '0' }"
                            />
                        </div>
                    </TransitionGroup>
                </div>
                <TheButton v-if="form.isWithdraws" @click.prevent="addWithdraw()" color="#088500" text-color="#fff">
                    Добавить снятие
                </TheButton>
            </div>

            <TheButton type="submit" color="#088500" text-color="#fff" width="100%" @click.prevent="calculate">
                Рассчитать
            </TheButton>
        </div>
    </form>
    <TheCalculationsResult v-if="calculationResult" :result="calculationResult" />
</template>

<style lang="scss" scoped>
@import "~/style.scss";

.calculator-form {
    display: flex;
    flex-direction: column;
    width: $content-width;
    margin-top: 20px;

    & > *:not(:last-child) {
        margin-bottom: 20px;
    }
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

.top-ups,
.withdraws {
    margin-top: 10px;
    margin-bottom: 10px;
}

.top-up-wrapper,
.withdraw-wrapper {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    width: 100%;
}

.deposit-change-enter-active,
.deposit-change-leave-active {
    transition: all 0.3s ease;
}

.deposit-change-enter-from,
.deposit-change-leave-to {
    opacity: 0;
    transform: translateX(50px);
}
</style>
