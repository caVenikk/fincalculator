<script lang="ts" setup>
import { checkRules } from "~/utils/validators.ts";
import { computed } from "vue";

const props = defineProps<{
    uid?: string;
    modelValue: any;
    options: { value: any; label: string }[];
    errorMessage?: string;
    noError?: boolean;
    rules?: ((v: string) => string | boolean)[];
    label?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: any];
    "update:errorMessage": [value: string];
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit("update:modelValue", target.value);
};

const isValid = computed(() => {
    const result = checkRules(props.rules, props.modelValue);
    if (props.noError) {
        emit("update:errorMessage", result === true ? "" : (result as string));
    }
    return result === true;
});

const uidPassed = computed(() => props.uid !== undefined);
</script>

<template>
    <div class="select-wrapper">
        <label v-if="label" :for="uidPassed ? uid : undefined" class="select-label">{{ label }}</label>
        <select
            :id="uidPassed ? uid : undefined"
            :class="{ invalid: !isValid }"
            :value="modelValue"
            class="the-select"
            @input="handleInput"
        >
            <option v-for="(option, index) in options" :key="index" :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <TransitionGroup name="error" tag="div">
            <div v-if="!isValid && !noError" class="error-message">
                {{ checkRules(rules, modelValue) }}
            </div>
        </TransitionGroup>
    </div>
</template>

<style lang="scss" scoped>
.select-label {
    margin-bottom: 4px;
    margin-right: 5px;
}

.the-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;

    &.invalid {
        border-color: red;
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
