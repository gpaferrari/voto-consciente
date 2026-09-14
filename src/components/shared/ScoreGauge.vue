<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  subtitle?: string;
}>(), {
  size: 'md',
  showLabel: true,
  subtitle: 'Score'
});

const colorClasses = computed(() => {
  if (props.score >= 85) return { text: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
  if (props.score >= 70) return { text: 'text-sky-600 dark:text-sky-400', stroke: '#0284c7', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' };
  if (props.score >= 50) return { text: 'text-amber-600 dark:text-amber-400', stroke: '#d97706', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
  return { text: 'text-rose-600 dark:text-rose-400', stroke: '#e11d48', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
});

const dimensions = computed(() => {
  if (props.size === 'sm') return { width: 54, height: 54, strokeWidth: 5, radius: 22, fontSize: 'text-sm' };
  if (props.size === 'lg') return { width: 120, height: 120, strokeWidth: 10, radius: 48, fontSize: 'text-3xl' };
  return { width: 84, height: 84, strokeWidth: 7, radius: 34, fontSize: 'text-xl' };
});

const circumference = computed(() => 2 * Math.PI * dimensions.value.radius);
const strokeDashoffset = computed(() => {
  const percent = Math.min(100, Math.max(0, props.score)) / 100;
  return circumference.value - (percent * circumference.value);
});
</script>

<template>
  <div class="inline-flex flex-col items-center justify-center">
    <div class="relative flex items-center justify-center">
      <svg
        :width="dimensions.width"
        :height="dimensions.height"
        class="transform -rotate-90"
      >
        <!-- Background Circle -->
        <circle
          :cx="dimensions.width / 2"
          :cy="dimensions.height / 2"
          :r="dimensions.radius"
          stroke="currentColor"
          :stroke-width="dimensions.strokeWidth"
          class="text-slate-200 dark:text-slate-800"
          fill="transparent"
        />
        <!-- Progress Circle -->
        <circle
          :cx="dimensions.width / 2"
          :cy="dimensions.height / 2"
          :r="dimensions.radius"
          :stroke="colorClasses.stroke"
          :stroke-width="dimensions.strokeWidth"
          stroke-linecap="round"
          fill="transparent"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-1000 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span :class="['font-bold tracking-tight', dimensions.fontSize, colorClasses.text]">
          {{ score.toFixed(score % 1 === 0 ? 0 : 1) }}
        </span>
      </div>
    </div>
    <span v-if="showLabel && subtitle" class="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {{ subtitle }}
    </span>
  </div>
</template>
