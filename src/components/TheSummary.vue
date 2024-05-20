<script setup lang="ts">
import { Summary } from "~/interfaces/payments.ts";
import TheTable from "~/components/ui/TheTable.vue";

const props = defineProps<{
    summary: Summary;
}>();

const summaryHeaders = ["Всего выплат", "Итоговый остаток вклада"];
</script>

<template>
    <div class="summary">
        <TheTable :headers="summaryHeaders" :data="[summary]" :widths="['40%', '60%']" />
    </div>
</template>

<style scoped lang="scss"></style>
