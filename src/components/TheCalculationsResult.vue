<script setup lang="ts">
import ThePayments from "~/components/ThePayments.vue";
import TheSummary from "~/components/TheSummary.vue";
import { CalculationResult } from "~/interfaces/payments.ts";

const props = defineProps<{
    result: CalculationResult;
}>();
</script>

<template>
    <div class="calculations-results">
        <ThePayments :payments="result.payments" />
        <TheSummary :summary="result.summary" />
    </div>
</template>

<style scoped lang="scss">
@import "~/style.scss";

.calculations-results {
    width: $content-width;
}
</style>
