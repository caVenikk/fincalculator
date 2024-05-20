<script setup lang="ts">
import { ref, withDefaults } from "vue";

export interface Props {
    type?: "button" | "submit" | "reset";
    color?: string;
    textColor?: string;
    height?: string | number;
    width?: string | number;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: "button",
    color: "#efefef",
    textColor: "#000",
    disabled: false,
});

const emit = defineEmits<{
    click: [value: Event];
}>();

const handleClick = (event: Event) => {
    emit("click", event);
};

// if type number is passed, it will be converted to string + 'px'
const dimensions = ref({
    height: typeof props.height === "number" ? `${props.height}px` : props.height,
    width: typeof props.width === "number" ? `${props.width}px` : props.width,
});

const styles = ref({
    backgroundColor: props.color,
    color: props.textColor,
    ...dimensions.value,
});
</script>

<template>
    <button
        class="the-button"
        :class="{ disabled: disabled }"
        @click="handleClick"
        :style="styles"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
.the-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition:
        background-color,
        opacity 0.3s;
    height: 40px;

    &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
        transition: opacity 0.3s;
    }
}
</style>
