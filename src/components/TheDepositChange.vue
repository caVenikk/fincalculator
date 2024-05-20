<script setup lang="ts">
import TheInput from "~/components/ui/TheInput.vue";
import { computed, ref, watch } from "vue";
import TheSelect from "~/components/ui/TheSelect.vue";
import { DepositChangeFrequency } from "~/enums/frequencies.ts";
import { mapDepositChangeFrequency } from "~/utils/mappers.ts";
import { ru } from "date-fns/locale";
import { DepositChange } from "~/interfaces/depositChange.ts";

const props = defineProps<{
    uid?: string;
    modelValue: DepositChange;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: DepositChange];
}>();

const localModelValue = ref<DepositChange>(props.modelValue);

watch(localModelValue, (value: DepositChange) => {
    emit("update:modelValue", value);
});

const frequencyOptions = computed<{ value: DepositChangeFrequency; label: string }[]>(() => {
    return Object.values(DepositChangeFrequency).map((frequency) => {
        return {
            value: frequency,
            label: mapDepositChangeFrequency(frequency),
        };
    });
});

const frequencyLabel = computed(() =>
    localModelValue.value.frequency === DepositChangeFrequency.ONE_TIME ? "Дата" : "Первый платеж"
);

const uidPassed = computed(() => props.uid !== undefined);
const minDatePassed = computed(() => props.minDate !== undefined);
const maxDatePassed = computed(() => props.maxDate !== undefined);
</script>

<template>
    <div class="deposit-change">
        <TheInput
            :uid="uidPassed ? `dc-${uid}` : undefined"
            v-model.number="localModelValue.amount"
            label="Сумма"
            type="number"
        />
        <TheSelect
            :uid="uidPassed ? `dc-${uid}` : undefined"
            :options="frequencyOptions"
            v-model="localModelValue.frequency"
            label="Периодичность"
        />
        <div class="datepicker-wrapper">
            <label class="datepicker-label" :for="uidPassed ? `dp-input-dc-${uid}` : undefined">
                {{ frequencyLabel }}
            </label>
            <VueDatePicker
                v-model="localModelValue.date"
                :auto-apply="true"
                :enable-time-picker="false"
                :format-locale="ru"
                :required="true"
                format="dd.MM.yyyy"
                locale="ru"
                :uid="uidPassed ? `dc-${uid}` : undefined"
                :min-date="minDatePassed ? minDate : undefined"
                :max-date="maxDatePassed ? maxDate : undefined"
            >
            </VueDatePicker>
        </div>
    </div>
</template>

<style scoped lang="scss">
.deposit-change {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
}
</style>
