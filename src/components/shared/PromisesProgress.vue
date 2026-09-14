<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  stats: {
    total: number;
    fulfilled: number;
    inProgress: number;
    notFulfilled: number;
  };
}>();

const fulfilledPercent = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.round((props.stats.fulfilled / props.stats.total) * 100);
});

const inProgressPercent = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.round((props.stats.inProgress / props.stats.total) * 100);
});

const notFulfilledPercent = computed(() => {
  if (props.stats.total === 0) return 0;
  return Math.max(0, 100 - fulfilledPercent.value - inProgressPercent.value);
});
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs">
      <span class="font-bold text-slate-700 dark:text-slate-300">Cumprimento de Promessas de Campanha</span>
      <span class="text-slate-500 dark:text-slate-400 font-medium">
        Total Monitorado: <strong class="text-slate-800 dark:text-slate-200">{{ stats.total }} propostas</strong>
      </span>
    </div>

    <!-- Barra Empilhada -->
    <div class="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 shadow-inner">
      <div
        :style="{ width: `${fulfilledPercent}%` }"
        class="bg-emerald-500 h-full rounded-l-full transition-all duration-700 relative group cursor-pointer"
        :title="`Cumpridas: ${stats.fulfilled} (${fulfilledPercent}%)`"
      ></div>
      <div
        :style="{ width: `${inProgressPercent}%` }"
        class="bg-sky-500 h-full transition-all duration-700 relative group cursor-pointer"
        :title="`Em Andamento: ${stats.inProgress} (${inProgressPercent}%)`"
      ></div>
      <div
        :style="{ width: `${notFulfilledPercent}%` }"
        class="bg-rose-500 h-full rounded-r-full transition-all duration-700 relative group cursor-pointer"
        :title="`Não Cumpridas: ${stats.notFulfilled} (${notFulfilledPercent}%)`"
      ></div>
    </div>

    <!-- Indicadores Numéricos -->
    <div class="grid grid-cols-3 gap-2 pt-1 text-center">
      <div class="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl">
        <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">Cumpridas</span>
        <div class="flex items-baseline justify-center gap-1 mt-0.5">
          <span class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ stats.fulfilled }}</span>
          <span class="text-[11px] font-bold text-emerald-700/80 dark:text-emerald-400">({{ fulfilledPercent }}%)</span>
        </div>
      </div>

      <div class="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 p-2.5 rounded-xl">
        <span class="text-xs font-semibold text-sky-800 dark:text-sky-300 block">Em Andamento</span>
        <div class="flex items-baseline justify-center gap-1 mt-0.5">
          <span class="text-xl font-extrabold text-sky-600 dark:text-sky-400">{{ stats.inProgress }}</span>
          <span class="text-[11px] font-bold text-sky-700/80 dark:text-sky-400">({{ inProgressPercent }}%)</span>
        </div>
      </div>

      <div class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 p-2.5 rounded-xl">
        <span class="text-xs font-semibold text-rose-800 dark:text-rose-300 block">Não Cumpridas</span>
        <div class="flex items-baseline justify-center gap-1 mt-0.5">
          <span class="text-xl font-extrabold text-rose-600 dark:text-rose-400">{{ stats.notFulfilled }}</span>
          <span class="text-[11px] font-bold text-rose-700/80 dark:text-rose-400">({{ notFulfilledPercent }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>
