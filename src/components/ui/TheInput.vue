<script lang="ts" setup>
import { computed } from "vue";
import { checkRules } from "~/utils/validators.ts";

export interface Props {
    uid?: string;
    modelValue: any;
    errorMessage?: string;
    noError?: boolean;
    type?: string;
    label?: string;
    rules?: ((v: string) => string | boolean)[];
}

const props = withDefaults(defineProps<Props>(), {
    type: "text",
});

const emit = defineEmits<{
    "update:modelValue": [value: any];
    "update:errorMessage": [value: string];
}>();

const rightLabelTypes = ["checkbox", "radio", "switch"];
const isLeftLabel = computed(() => !rightLabelTypes.includes(props.type));
const isRightLabel = computed(() => rightLabelTypes.includes(props.type));

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = props.type === "checkbox" ? target.checked : target.value;
    emit("update:modelValue", value);
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
    <div class="input-error-wrapper">
        <div class="input-wrapper">
            <label
                v-if="label && isLeftLabel"
                :class="{ 'left-label': isLeftLabel }"
                :for="uidPassed ? uid : undefined"
                class="input-label"
            >
                {{ label }}
            </label>
            <input
                :id="uidPassed ? uid : undefined"
                :class="{ invalid: !isValid }"
                :type="type"
                :value="modelValue"
                class="the-input"
                @input="handleInput"
            />
            <label
                v-if="label && isRightLabel"
                :class="{ 'right-label': isRightLabel }"
                :for="uidPassed ? uid : undefined"
                class="input-label"
            >
                {{ label }}
            </label>
            <slot name="after"></slot>
        </div>
        <TransitionGroup name="error" tag="div">
            <div v-if="!isValid && !noError" class="error-message">
                {{ checkRules(rules, modelValue) }}
            </div>
        </TransitionGroup>
    </div>
</template>

<style lang="scss" scoped>
.input-error-wrapper {
    display: flex;
    flex-direction: column;
}

.input-label {
    margin-bottom: 4px;

    &.left-label {
        margin-right: 5px;
    }

    &.right-label {
        margin-left: 5px;
    }
}

.the-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease-in-out;

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
