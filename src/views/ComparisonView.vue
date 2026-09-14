<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCandidateStore } from '../stores/candidateStore';
import ScoreGauge from '../components/shared/ScoreGauge.vue';
import RadarChart from '../components/shared/RadarChart.vue';
import { 
  Layers, 
  X, 
  Plus, 
  GraduationCap, 
  Briefcase, 
  Tv, 
  ShieldCheck, 
  Coins, 
  ArrowRight,
  TrendingUp
} from 'lucide-vue-next';

const router = useRouter();
const store = useCandidateStore();

const candidates = computed(() => store.comparisonCandidates);

const availableCandidatesToAdd = computed(() => {
  return store.scoredCandidates.filter(c => !store.selectedForComparison.includes(c.id));
});

function removeCandidate(id: string) {
  store.toggleComparison(id);
}

function addCandidate(id: string) {
  store.toggleComparison(id);
}

function formattedCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(val);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
    <!-- Cabeçalho -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Layers class="w-4 h-4" />
          <span>Ferramenta Comparativa</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Comparador Lado a Lado de Candidatos
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compare formação, experiência, sabatinas, ficha limpa e propostas de até 3 candidatos simultaneamente.
        </p>
      </div>

      <button
        v-if="candidates.length > 0"
        @click="store.clearComparison"
        class="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline self-start sm:self-auto"
      >
        Limpar Comparação
      </button>
    </div>

    <!-- Se menos de 2 candidatos selecionados -->
    <div
      v-if="candidates.length < 2"
      class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4"
    >
      <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
        <Layers class="w-7 h-7" />
      </div>
      <div class="max-w-md mx-auto space-y-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Selecione pelo menos 2 candidatos</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Escolha os candidatos que deseja confrontar lado a lado. Você pode selecionar candidatos na lista ou nos cards abaixo:
        </p>
      </div>

      <!-- Sugestões para adicionar -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          v-for="c in availableCandidatesToAdd.slice(0, 4)"
          :key="c.id"
          @click="addCandidate(c.id)"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Plus class="w-3.5 h-3.5 text-emerald-500" />
          <span>{{ c.popularName }} ({{ c.party }})</span>
        </button>
      </div>
    </div>

    <!-- Comparação Ativa -->
    <div v-else class="space-y-8">
      <!-- Radar Comparativo de Teia (se exatamente 2 candidatos) -->
      <div v-if="candidates.length === 2" class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col items-center">
        <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">
          Sobreposição de Radar: {{ candidates[0].popularName }} vs {{ candidates[1].popularName }}
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
          Compare visualmente o equilíbrio de pontos fortes em cada uma das 5 dimensões avaliadas.
        </p>

        <RadarChart
          :primary="{
            name: candidates[0].popularName,
            color: '#10b981',
            fillColor: 'rgba(16, 185, 129, 0.25)',
            breakdown: candidates[0].breakdown
          }"
          :secondary="{
            name: candidates[1].popularName,
            color: '#6366f1',
            fillColor: 'rgba(99, 102, 241, 0.25)',
            breakdown: candidates[1].breakdown
          }"
          :size="320"
        />
      </div>

      <!-- Tabela Comparativa Lado a Lado -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <th class="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Critério</th>
              <th
                v-for="c in candidates"
                :key="c.id"
                class="p-5 text-center relative w-1/3"
              >
                <button
                  @click="removeCandidate(c.id)"
                  class="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                  title="Remover da comparação"
                >
                  <X class="w-4 h-4" />
                </button>

                <div class="flex flex-col items-center space-y-2">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/30">
                    <img :src="c.photoUrl" :alt="c.name" class="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <span class="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {{ c.party }} - {{ c.ballotNumber }}
                    </span>
                    <h4 class="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {{ c.popularName }}
                    </h4>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <!-- Linha: Score Geral -->
            <tr class="bg-emerald-50/30 dark:bg-emerald-950/10">
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">Score Geral</td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <div class="inline-flex justify-center">
                  <ScoreGauge :score="c.breakdown.finalScore" size="sm" :showLabel="false" />
                </div>
              </td>
            </tr>

            <!-- Linha: Escolaridade -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <GraduationCap class="w-3.5 h-3.5 text-emerald-500" />
                  <span>Escolaridade & Diploma</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <strong class="text-slate-900 dark:text-white block">{{ c.education.course }}</strong>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{{ c.education.institution }}</span>
                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">Nota: {{ c.breakdown.educationScore }}/100</span>
              </td>
            </tr>

            <!-- Linha: Experiência -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <Briefcase class="w-3.5 h-3.5 text-sky-500" />
                  <span>Experiência no Serviço Público</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <strong class="text-slate-900 dark:text-white text-sm block">{{ c.experience.yearsInPublicService }} anos</strong>
                <span class="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{{ c.experience.roles.length }} cargos principais exercidos</span>
                <span class="text-[10px] font-bold text-sky-600 dark:text-sky-400 mt-1 inline-block">Nota: {{ c.breakdown.experienceScore }}/100</span>
              </td>
            </tr>

            <!-- Linha: Sabatinas -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <Tv class="w-3.5 h-3.5 text-purple-500" />
                  <span>Sabatinas & Debates</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <strong class="text-slate-900 dark:text-white block">Média {{ c.debatesAndInterviews.averageScore }}/100</strong>
                <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-1 inline-block">Nota: {{ c.breakdown.debatesScore }}/100</span>
              </td>
            </tr>

            <!-- Linha: Integridade & Fatos -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="w-3.5 h-3.5 text-amber-500" />
                  <span>Ficha Limpa & Fatos Oficiais</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <strong class="text-slate-900 dark:text-white block">{{ c.integrityAndFacts.factChecks.length }} fatos auditados</strong>
                <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 inline-block">Nota: {{ c.breakdown.integrityScore }}/100</span>
              </td>
            </tr>

            <!-- Linha: Bens Declarados -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <Coins class="w-3.5 h-3.5 text-amber-500" />
                  <span>Patrimônio no TSE</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                {{ formattedCurrency(c.declaredAssets) }}
              </td>
            </tr>

            <!-- Linha: Proposta Principal Economia -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">
                <div class="flex items-center gap-1.5">
                  <TrendingUp class="w-3.5 h-3.5 text-teal-500" />
                  <span>Meta Principal de Economia</span>
                </div>
              </td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center text-slate-600 dark:text-slate-300">
                {{ c.governmentPlan.pillars.find(p => p.key === 'economia')?.mainGoal || 'Ver plano completo' }}
              </td>
            </tr>

            <!-- Ações -->
            <tr>
              <td class="p-4 font-bold text-slate-800 dark:text-slate-200">Ações</td>
              <td v-for="c in candidates" :key="c.id" class="p-4 text-center">
                <button
                  @click="router.push(`/candidato/${c.id}`)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight class="w-3 h-3" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
