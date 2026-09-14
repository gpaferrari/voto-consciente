<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCandidateStore } from '../stores/candidateStore';
import ScoreGauge from '../components/shared/ScoreGauge.vue';
import RadarChart from '../components/shared/RadarChart.vue';
import GovPlanViewer from '../components/candidate/GovPlanViewer.vue';
import FactCheckTimeline from '../components/candidate/FactCheckTimeline.vue';
import { 
  ArrowLeft, 
  MapPin, 
  Coins, 
  GraduationCap, 
  Briefcase, 
  Tv, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Check, 
  ActivitySquare
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const store = useCandidateStore();

const candidateId = computed(() => route.params.id as string);
const candidate = computed(() => store.getCandidateById(candidateId.value));

const isSelectedForComparison = computed(() => {
  return candidate.value ? store.selectedForComparison.includes(candidate.value.id) : false;
});

const formattedAssets = computed(() => {
  if (!candidate.value) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(candidate.value.declaredAssets);
});

const roleLabel = computed(() => {
  if (!candidate.value) return '';
  switch (candidate.value.role) {
    case 'presidente': return 'Presidente da República';
    case 'governador_sp': return 'Governador de SP';
    case 'senador': return 'Senador por SP';
    case 'deputado_federal_bauru': return 'Deputado Federal (Bauru/SP)';
  }
});

function toggleCompare() {
  if (candidate.value) {
    store.toggleComparison(candidate.value.id);
  }
}
</script>

<template>
  <div v-if="candidate" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
    <!-- Breadcrumb e Voltar -->
    <div class="flex items-center justify-between">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Voltar à lista</span>
      </button>

      <!-- Botão Comparar -->
      <button
        @click="toggleCompare"
        :class="[
          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border',
          isSelectedForComparison
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
        ]"
      >
        <Check v-if="isSelectedForComparison" class="w-3.5 h-3.5" />
        <Layers v-else class="w-3.5 h-3.5 text-emerald-500" />
        <span>{{ isSelectedForComparison ? 'Selecionado para Comparação' : 'Adicionar ao Comparador' }}</span>
      </button>
    </div>

    <!-- Header do Candidato -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-xs">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <!-- Foto Oficial -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/30 shadow-md shrink-0">
            <img
              :src="candidate.photoUrl"
              :alt="candidate.name"
              class="w-full h-full object-cover object-top"
            />
            <div class="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent py-0.5 text-center">
              <span class="text-xs font-black text-white tracking-widest">{{ candidate.ballotNumber }}</span>
            </div>
          </div>

          <!-- Informações de Perfil -->
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-slate-900 text-white dark:bg-white dark:text-slate-900 uppercase tracking-wider">
                {{ candidate.party }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ roleLabel }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {{ candidate.name }}
            </h1>
            <p class="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Nome na Urna: <strong class="text-slate-700 dark:text-slate-200">{{ candidate.popularName }}</strong>
            </p>

            <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-slate-400" />
                {{ candidate.cityOrigin || 'Brasil' }}
              </span>
              <span>• {{ candidate.age }} anos</span>
              <span class="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <Coins class="w-3.5 h-3.5 text-amber-500" />
                Bens declarados: <strong>{{ formattedAssets }}</strong>
              </span>
            </div>

            <!-- Observação de Cargo Atual em Exercício (ex: Fernando Haddad como Ministro da Fazenda) -->
            <div
              v-if="candidate.currentOfficeNote"
              class="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Contexto Institucional: <strong>{{ candidate.currentOfficeNote }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Score Geral em Destaque -->
        <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0 self-start md:self-auto">
          <ScoreGauge :score="candidate.breakdown.finalScore" size="lg" subtitle="Score Geral" />
          <div class="text-left space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Classificação</span>
            <div class="text-sm font-black text-slate-900 dark:text-white">
              {{ candidate.breakdown.finalScore >= 85 ? 'Alta Aptidão Eleitoral' : candidate.breakdown.finalScore >= 70 ? 'Boa Aptidão Eleitoral' : 'Aptidão Média / Ressalvas' }}
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Média ponderada dos 5 pilares
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Seção de Análise do Score: Radar Chart e Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Radar Chart -->
      <div class="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col items-center">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2 self-start flex items-center gap-2">
          <span>Gráfico de Teia (Radar de Habilidades)</span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 self-start">
          Equilíbrio entre formação, experiência pública, sabatinas, integridade e viabilidade do plano.
        </p>

        <RadarChart
          :primary="{
            name: candidate.popularName,
            color: '#10b981',
            fillColor: 'rgba(16, 185, 129, 0.25)',
            breakdown: candidate.breakdown
          }"
          :size="300"
        />
      </div>

      <!-- Detalhamento dos 5 Pilares com Barras -->
      <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            Composição Detalhada do Score (0 a 100)
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Critérios transparentes calculados de forma independente.
          </p>
        </div>

        <div class="space-y-3.5 pt-2">
          <!-- 1. Escolaridade -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <GraduationCap class="w-4 h-4 text-emerald-500" />
                1. Escolaridade & Formação Acadêmica
              </span>
              <span class="font-black text-sm text-emerald-600 dark:text-emerald-400">{{ candidate.breakdown.educationScore }}/100</span>
            </div>
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div :style="{ width: `${candidate.breakdown.educationScore}%` }" class="h-full bg-emerald-500 rounded-full transition-all duration-700"></div>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400">
              {{ candidate.education.details }}
            </p>
          </div>

          <!-- 2. Experiência -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Briefcase class="w-4 h-4 text-sky-500" />
                2. Experiência & Histórico de Gestão
              </span>
              <span class="font-black text-sm text-sky-600 dark:text-sky-400">{{ candidate.breakdown.experienceScore }}/100</span>
            </div>
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div :style="{ width: `${candidate.breakdown.experienceScore}%` }" class="h-full bg-sky-500 rounded-full transition-all duration-700"></div>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400">
              {{ candidate.experience.summary }}
            </p>
          </div>

          <!-- 3. Sabatinas -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Tv class="w-4 h-4 text-purple-500" />
                3. Sabatinas & Debates Oficiais
              </span>
              <span class="font-black text-sm text-purple-600 dark:text-purple-400">{{ candidate.breakdown.debatesScore }}/100</span>
            </div>
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div :style="{ width: `${candidate.breakdown.debatesScore}%` }" class="h-full bg-purple-500 rounded-full transition-all duration-700"></div>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400">
              Desempenho avaliado em debates televisionados com acurácia média de checagem.
            </p>
          </div>

          <!-- 4. Integridade -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShieldCheck class="w-4 h-4 text-amber-500" />
                4. Integridade, Ficha Limpa & Fatos Oficiais
              </span>
              <span class="font-black text-sm text-amber-600 dark:text-amber-400">{{ candidate.breakdown.integrityScore }}/100</span>
            </div>
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div :style="{ width: `${candidate.breakdown.integrityScore}%` }" class="h-full bg-amber-500 rounded-full transition-all duration-700"></div>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400">
              Baseado em certidões negativas de tribunais superiores e ausência de condenações colegiadas.
            </p>
          </div>

          <!-- 5. Plano de Governo -->
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText class="w-4 h-4 text-teal-500" />
                5. Viabilidade do Plano de Governo
              </span>
              <span class="font-black text-sm text-teal-600 dark:text-teal-400">{{ candidate.breakdown.governmentPlanScore }}/100</span>
            </div>
            <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div :style="{ width: `${candidate.breakdown.governmentPlanScore}%` }" class="h-full bg-teal-500 rounded-full transition-all duration-700"></div>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400">
              Coerência fiscal, clareza das metas e viabilidade orçamentária dos pilares.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Banner se for o Mandato Atual -->
    <div
      v-if="candidate.mandateEvaluation"
      class="bg-linear-to-r from-sky-900 to-indigo-950 text-white rounded-3xl p-6 border border-sky-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <span class="text-xs font-extrabold uppercase tracking-wider text-sky-400">Mandato em Exercício</span>
        <h4 class="text-xl font-black">Auditoria Completa do Mandato Presidencial</h4>
        <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Veja a evolução detalhada de todas as promessas da campanha anterior, gráficos oficiais de PIB, IPCA, dívida pública e programas sociais.
        </p>
      </div>

      <button
        @click="router.push('/mandato-atual')"
        class="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shrink-0 transition-colors flex items-center gap-2"
      >
        <ActivitySquare class="w-4 h-4" />
        <span>Abrir Auditoria do Mandato</span>
      </button>
    </div>

    <!-- Trajetória e Histórico de Cargos -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-xs space-y-6">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
          <Briefcase class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Trajetória e Principais Cargos Ocupados</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Histórico de mandatos e realizações no serviço público</p>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="(role, rIdx) in candidate.experience.roles"
          :key="rIdx"
          class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
              {{ role.title }}
            </h4>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {{ role.period }}
            </span>
          </div>

          <ul class="space-y-1.5 pt-1">
            <li
              v-for="(ach, aIdx) in role.achievements"
              :key="aIdx"
              class="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed"
            >
              <span class="text-emerald-500 font-bold">•</span>
              <span>{{ ach }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Produtividade Parlamentar se houver -->
      <div v-if="candidate.experience.legislativeStats" class="pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Indicadores Oficiais de Produtividade Parlamentar (Câmara / Senado)
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Projetos Apresentados</span>
            <span class="text-lg font-black text-slate-900 dark:text-white">{{ candidate.experience.legislativeStats.billsProposed }}</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Projetos Aprovados / Leis</span>
            <span class="text-lg font-black text-emerald-600 dark:text-emerald-400">{{ candidate.experience.legislativeStats.billsApproved }}</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Assiduidade em Plenário</span>
            <span class="text-lg font-black text-sky-600 dark:text-sky-400">{{ candidate.experience.legislativeStats.attendanceRate }}%</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Cota Parlamentar / Ano</span>
            <span class="text-xs font-black text-slate-800 dark:text-slate-200">
              {{ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(candidate.experience.legislativeStats.parliamentaryQuotaSpentYearlyAvg) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Leitor do Plano de Governo Descomplicado -->
    <GovPlanViewer :candidate="candidate" />

    <!-- Fatos Verificados, Decisões Judiciais & Notícias Oficiais -->
    <FactCheckTimeline
      :items="candidate.integrityAndFacts.factChecks"
      :cleanCertificates="candidate.integrityAndFacts.cleanRecordCertificates"
    />
  </div>

  <div v-else class="text-center py-24">
    <p class="text-slate-500">Candidato não encontrado.</p>
  </div>
</template>
