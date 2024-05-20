<script setup lang="ts">
import { defineProps, ref, withDefaults } from "vue";

export interface TableProps {
    headers: string[];
    data: { [key: string]: any }[];
    headerColor?: string;
    headerTextColor?: string;
    widths?: string[];
    rowColor?: string;
    rowTextColor?: string;
    closable?: boolean;
    round?: number;
}

const props = withDefaults(defineProps<TableProps>(), {
    headerColor: "#efefef",
    headerTextColor: "#000",
    rowColor: "#fff",
    rowTextColor: "#000",
    closable: false,
});

const styles = ref({
    header: {
        backgroundColor: props.headerColor,
        color: props.headerTextColor,
        cursor: props.closable ? "pointer" : "default",
    },
    row: {
        backgroundColor: props.rowColor,
        color: props.rowTextColor,
    },
});

const isContentVisible = ref(true);

const toggleContentVisibility = () => {
    if (props.closable) {
        isContentVisible.value = !isContentVisible.value;
    }
};

const getItem = (item: any) => {
    if (item instanceof Date) {
        return item.toLocaleDateString("ru-RU");
    } else if (typeof item === "number") {
        return formatNumber(item);
    }
    return item;
};

const formatNumber = (num: number) => {
    if (props.round !== undefined) {
        return num.toFixed(props.round);
    }
    return num;
};
</script>

<template>
    <table class="the-table">
        <thead>
            <tr @click="toggleContentVisibility">
                <th
                    v-for="(header, index) in headers"
                    :key="header"
                    :style="[styles.header, { width: props.widths ? props.widths[index] : 'auto' }]"
                >
                    {{ header }}
                </th>
            </tr>
        </thead>
        <transition name="slide-fade">
            <tbody v-show="isContentVisible">
                <tr v-for="(row, rowIndex) in data" :key="rowIndex" :style="styles.row">
                    <td
                        v-for="(item, itemIndex) in row"
                        :key="itemIndex"
                        :style="{ width: props.widths ? props.widths[itemIndex as number] : 'auto' }"
                    >
                        {{ getItem(item) }}
                    </td>
                </tr>
            </tbody>
        </transition>
    </table>
</template>

<style scoped lang="scss">
$the-table-padding: 10px 20px;
$the-table-border: 1px solid #ddd;
$the-table-font-size: 14px;
$the-table-border-radius: 10px;
$the-table-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
$the-table-hover-color: #f1f1f1;

.the-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: $the-table-font-size;
    text-align: center;
    border-radius: $the-table-border-radius;
    overflow: hidden;
    box-shadow: $the-table-box-shadow;

    th,
    td {
        padding: $the-table-padding;
        border: $the-table-border;
        transition: background-color 0.3s;
    }

    th {
        background-color: #efefef;
        color: #000;
    }

    td {
        background-color: #fff;
        color: #000;
    }

    tbody tr:hover {
        background-color: $the-table-hover-color;
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
