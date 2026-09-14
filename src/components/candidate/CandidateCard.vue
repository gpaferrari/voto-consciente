<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Candidate, ScoreBreakdown } from '../../types/candidate';
import { useCandidateStore } from '../../stores/candidateStore';
import ScoreGauge from '../shared/ScoreGauge.vue';
import { 
  GraduationCap, 
  Briefcase, 
  Tv, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Layers, 
  MapPin, 
  Coins,
  Check
} from 'lucide-vue-next';

const props = defineProps<{
  candidate: Candidate & { breakdown: ScoreBreakdown };
}>();

const router = useRouter();
const store = useCandidateStore();

const isSelectedForComparison = computed(() => {
  return store.selectedForComparison.includes(props.candidate.id);
});

const formattedAssets = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(props.candidate.declaredAssets);
});

const roleLabel = computed(() => {
  switch (props.candidate.role) {
    case 'presidente': return 'Presidente da República';
    case 'governador_sp': return 'Governador de SP';
    case 'senador': return 'Senador por SP';
    case 'deputado_federal_bauru': return 'Dep. Federal (Bauru/SP)';
  }
});

function goToDetails() {
  router.push(`/candidato/${props.candidate.id}`);
}

function toggleCompare() {
  store.toggleComparison(props.candidate.id);
}
</script>

<template>
  <div
    :class="[
      'group relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden',
      isSelectedForComparison
        ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
        : 'border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
    ]"
  >
    <!-- Topo do Card -->
    <div class="p-5 md:p-6 space-y-4">
      <div class="flex items-start justify-between gap-3">
        <!-- Foto e Info básica -->
        <div class="flex items-center gap-3.5">
          <div class="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner">
            <img
              :src="candidate.photoUrl"
              :alt="candidate.name"
              class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 to-transparent p-0.5 text-center">
              <span class="text-[10px] font-black text-white tracking-widest">{{ candidate.ballotNumber }}</span>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {{ candidate.party }}
              </span>
              <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {{ roleLabel }}
              </span>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {{ candidate.popularName }}
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin class="w-3 h-3 shrink-0" />
              <span>{{ candidate.cityOrigin || 'Brasil' }}</span>
              <span>• {{ candidate.age }} anos</span>
            </p>

            <!-- Observação Institucional / Cargo Atual em Exercício -->
            <div v-if="candidate.currentOfficeNote" class="mt-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 max-w-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span class="truncate">{{ candidate.currentOfficeNote }}</span>
            </div>
          </div>
        </div>

        <!-- Gauge do Score -->
        <div class="shrink-0">
          <ScoreGauge :score="candidate.breakdown.finalScore" size="sm" subtitle="Score Geral" />
        </div>
      </div>

      <!-- Barra dos 5 Pilares do Score -->
      <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <!-- 1. Escolaridade -->
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <GraduationCap class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Escolaridade:</span>
            <strong class="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[140px]">
              {{ candidate.education.course }}
            </strong>
          </span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ candidate.breakdown.educationScore }}</span>
        </div>

        <!-- 2. Experiência -->
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Briefcase class="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>Experiência:</span>
            <strong class="text-slate-800 dark:text-slate-200 font-semibold">
              {{ candidate.experience.yearsInPublicService }} anos
            </strong>
          </span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ candidate.breakdown.experienceScore }}</span>
        </div>

        <!-- 3. Sabatinas -->
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Tv class="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Sabatinas:</span>
          </span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ candidate.breakdown.debatesScore }}</span>
        </div>

        <!-- 4. Integridade -->
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Integridade:</span>
          </span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ candidate.breakdown.integrityScore }}</span>
        </div>

        <!-- 5. Plano de Governo -->
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <FileText class="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Plano de Governo:</span>
          </span>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ candidate.breakdown.governmentPlanScore }}</span>
        </div>
      </div>

      <!-- Info de Bens Declarados no TSE -->
      <div class="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
        <span class="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Coins class="w-3.5 h-3.5 text-amber-500" />
          Bens no TSE:
        </span>
        <span class="font-semibold text-slate-800 dark:text-slate-200">{{ formattedAssets }}</span>
      </div>
    </div>

    <!-- Rodapé de Ações do Card -->
    <div class="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
      <!-- Botão Comparar -->
      <button
        @click="toggleCompare"
        :class="[
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
          isSelectedForComparison
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        ]"
      >
        <Check v-if="isSelectedForComparison" class="w-3.5 h-3.5" />
        <Layers v-else class="w-3.5 h-3.5" />
        <span>{{ isSelectedForComparison ? 'Selecionado' : 'Comparar' }}</span>
      </button>

      <!-- Botão Ver Perfil -->
      <button
        @click="goToDetails"
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
      >
        <span>Ver Perfil & Plano</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
