<script setup lang="ts">
import { Payment } from "~/interfaces/payments.ts";
import TheTable from "~/components/ui/TheTable.vue";

const props = defineProps<{
    payments: Payment[];
}>();

const paymentHeaders = ["Дата", "Начисленная сумма", "Остаток вклада"];
</script>

<template>
    <div class="payments">
        <TheTable :headers="paymentHeaders" :data="payments" :closable="true" :widths="['20%', '40%', '40%']" />
    </div>
</template>

<style scoped lang="scss"></style>
