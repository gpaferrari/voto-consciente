<script setup lang="ts">
import { ref, computed } from 'vue';
import { Candidate, GovPlanPillar } from '../../types/candidate';
import { 
  TrendingUp, 
  GraduationCap, 
  Activity, 
  ShieldAlert, 
  Leaf, 
  Building2, 
  Cpu, 
  ExternalLink, 
  Coins, 
  Target,
  FileCheck2
} from 'lucide-vue-next';

const props = defineProps<{
  candidate: Candidate;
}>();

const activePillarIndex = ref(0);

const pillars = computed(() => props.candidate.governmentPlan.pillars);
const currentPillar = computed(() => pillars.value[activePillarIndex.value] || pillars.value[0]);

function getPillarIcon(key: GovPlanPillar['key']) {
  switch (key) {
    case 'economia': return TrendingUp;
    case 'educacao': return GraduationCap;
    case 'saude': return Activity;
    case 'seguranca': return ShieldAlert;
    case 'meio_ambiente': return Leaf;
    case 'infraestrutura': return Building2;
    default: return Cpu;
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
    <!-- Header do Plano -->
    <div class="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/60">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <FileCheck2 class="w-3.5 h-3.5" />
            Registrado no TSE
          </span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-2">
            Plano de Governo Estruturado
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {{ candidate.governmentPlan.summary }}
          </p>
        </div>

        <a
          :href="candidate.governmentPlan.pdfUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0 self-start md:self-center"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          Ver PDF Original no TSE
        </a>
      </div>

      <!-- Navegação dos Pilares (Tabs) -->
      <div class="flex items-center gap-2 overflow-x-auto pt-5 pb-1 no-scrollbar">
        <button
          v-for="(pillar, idx) in pillars"
          :key="pillar.key"
          @click="activePillarIndex = idx"
          :class="[
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0',
            activePillarIndex === idx
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <component :is="getPillarIcon(pillar.key)" class="w-4 h-4" />
          <span>{{ pillar.title }}</span>
        </button>
      </div>
    </div>

    <!-- Conteúdo do Pilar Ativo -->
    <div v-if="currentPillar" class="p-5 md:p-6 space-y-6">
      <!-- Meta Principal -->
      <div class="bg-linear-to-br from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
            <Target class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Meta Principal do Pilar</span>
            <p class="text-base md:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {{ currentPillar.mainGoal }}
            </p>
          </div>
        </div>

        <!-- Medidor de Viabilidade -->
        <div class="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-3 shrink-0 flex items-center gap-3">
          <div>
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Viabilidade Fiscal & Técnica</span>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ currentPillar.feasibilityScore }}/100</span>
              <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">Alta</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Propostas Práticas -->
      <div>
        <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Ações e Medidas Práticas Anunciadas
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(proposal, pIdx) in currentPillar.proposals"
            :key="pIdx"
            class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
          >
            <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {{ pIdx + 1 }}
            </div>
            <p class="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {{ proposal }}
            </p>
          </div>
        </div>
      </div>

      <!-- De onde virá o Orçamento? -->
      <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-3">
        <div class="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5">
          <Coins class="w-4 h-4" />
        </div>
        <div>
          <span class="text-xs font-bold text-amber-900 dark:text-amber-300 block">Fonte de Financiamento Declarada</span>
          <p class="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
            {{ currentPillar.budgetSource }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
