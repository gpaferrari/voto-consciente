<script setup lang="ts">
import { computed } from 'vue';
import { FactCategory } from '../../types/candidate';
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldCheck, Archive } from 'lucide-vue-next';

const props = defineProps<{
  category: FactCategory;
  showIcon?: boolean;
}>();

const config = computed(() => {
  switch (props.category) {
    case 'comprovado_positivo':
      return {
        label: 'Fato Comprovado Oficial',
        icon: CheckCircle2,
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
      };
    case 'condenacao_judicial':
      return {
        label: 'Condenação Colegiada / TCU',
        icon: AlertOctagon,
        classes: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
      };
    case 'investigacao_em_curso':
      return {
        label: 'Em Apuração (Presunção de Inocência)',
        icon: AlertTriangle,
        classes: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
      };
    case 'boato_desmentido':
      return {
        label: 'Boato Desmentido por Agência',
        icon: ShieldCheck,
        classes: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
      };
    case 'arquivado':
      return {
        label: 'Processo Arquivado / Absolvição',
        icon: Archive,
        classes: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      };
  }
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
      config.classes
    ]"
  >
    <component :is="config.icon" v-if="showIcon !== false" class="w-3.5 h-3.5 shrink-0" />
    <span>{{ config.label }}</span>
  </span>
</template>
