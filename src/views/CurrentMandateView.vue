<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCandidateStore } from '../stores/candidateStore';
import ScoreGauge from '../components/shared/ScoreGauge.vue';
import EconomicTrendChart from '../components/shared/EconomicTrendChart.vue';
import PromisesProgress from '../components/shared/PromisesProgress.vue';
import { 
  ActivitySquare, 
  TrendingUp, 
  GraduationCap, 
  Coins, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle
} from 'lucide-vue-next';

const store = useCandidateStore();

const president = computed(() => store.currentPresident);
const evaluation = computed(() => president.value?.mandateEvaluation);

const promiseFilter = ref<'all' | 'cumprida' | 'em_andamento' | 'nao_cumprida'>('all');

const filteredPromises = computed(() => {
  if (!evaluation.value) return [];
  if (promiseFilter.value === 'all') return evaluation.value.promisesList;
  return evaluation.value.promisesList.filter(p => p.status === promiseFilter.value);
});
</script>

<template>
  <div v-if="president && evaluation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24">
    <!-- Cabeçalho de Auditoria -->
    <div class="bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-5">
          <!-- Foto do Presidente -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 border-2 border-sky-500/50 shadow-md shrink-0">
            <img
              :src="president.photoUrl"
              :alt="president.name"
              class="w-full h-full object-cover object-top"
            />
          </div>

          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
              <ActivitySquare class="w-3.5 h-3.5" />
              <span>Auditoria Oficial de Mandato Presidencial</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black">
              Avaliação do Mandato: {{ president.name }}
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Período: <strong class="text-white">{{ evaluation.mandatePeriod }}</strong> • Partidos de Base e Coalizão
            </p>
          </div>
        </div>

        <!-- Score do Mandato -->
        <div class="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shrink-0">
          <ScoreGauge :score="evaluation.mandateScore" size="lg" subtitle="Score do Mandato" />
          <div class="text-left space-y-1 max-w-[170px]">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Desempenho</span>
            <div class="text-sm font-bold text-white">
              Sólido com Desafios Fiscais
            </div>
            <p class="text-[10px] text-slate-400 leading-tight">
              Baseado em PIB, emprego, inflação e promessas
            </p>
          </div>
        </div>
      </div>

      <!-- Síntese dos Auditores -->
      <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
        <strong class="text-white block font-bold">Síntese Analítica do Mandato:</strong>
        <p>{{ evaluation.auditorSynthesis }}</p>
      </div>
    </div>

    <!-- Cards de Destaque Macroeconômico Rápido (KPIs) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <!-- PIB -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">PIB Médio Anual</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">+2,9%</span>
          <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">Acima do Focus</span>
        </div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400">Superou as projeções do mercado</p>
      </div>

      <!-- Inflação -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Inflação (IPCA 2024)</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-sky-600 dark:text-sky-400">4,25%</span>
          <span class="text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded-sm">Dentro do Teto</span>
        </div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400">Teto da meta do Banco Central: 4,5%</p>
      </div>

      <!-- Desemprego -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Taxa de Desemprego</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-purple-600 dark:text-purple-400">6,8%</span>
          <span class="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded-sm">Recorde Histórico</span>
        </div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400">Menor desemprego em uma década (IBGE)</p>
      </div>

      <!-- Dívida Pública -->
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Dívida Bruta / PIB</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-amber-600 dark:text-amber-400">77,8%</span>
          <span class="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded-sm">Ponto de Atenção</span>
        </div>
        <p class="text-[10px] text-slate-500 dark:text-slate-400">Crescimento exige contenção de gastos</p>
      </div>
    </div>

    <!-- Gráfico Interativo de Tendências Econômicas -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-emerald-500" />
            Evolução Histórica dos Indicadores Econômicos Oficiais
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Alterne entre PIB, inflação, desemprego, dívida pública e resultado das contas públicas.
          </p>
        </div>
      </div>

      <EconomicTrendChart
        :pibData="evaluation.economicIndicators.pibGrowth"
        :inflationData="evaluation.economicIndicators.inflationIpca"
        :unemploymentData="evaluation.economicIndicators.unemploymentRate"
        :debtData="evaluation.economicIndicators.publicDebtGdpRatio"
        :fiscalData="evaluation.economicIndicators.primaryFiscalBalance"
      />
    </div>

    <!-- Análise de Gastos Públicos: OK vs Desnecessário -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-xs space-y-6">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
          <Coins class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Auditoria dos Gastos Públicos: Onde Está OK vs Pontos Críticos</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Conforme dados do Tesouro Nacional, SIAFI e Tribunal de Contas da União (TCU).
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- O que está OK / Produtivo -->
        <div class="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-3">
          <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Gastos Prioritários e Eficientes (OK)</span>
          </div>
          <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">•</span>
              <span><strong>Recomposição do Piso de Saúde e Educação:</strong> Fim do congelamento do teto anterior com destinação garantida para hospitais do SUS e merenda escolar.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">•</span>
              <span><strong>Poupança do Ensino Médio (Pé-de-Meia):</strong> Redução comprovada da evasão escolar de adolescentes de baixa renda.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-600 font-bold">•</span>
              <span><strong>Desenrola Brasil:</strong> Custo orçamentário reduzido com alto retorno ao destravar o consumo de 15 milhões de endividados.</span>
            </li>
          </ul>
        </div>

        <!-- Pontos de Atenção / Gastos Questionados -->
        <div class="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 space-y-3">
          <div class="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <AlertTriangle class="w-4 h-4 text-rose-600" />
            <span>Pontos de Atenção e Pressão Fiscal (Alertas)</span>
          </div>
          <ul class="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li class="flex items-start gap-2">
              <span class="text-rose-600 font-bold">•</span>
              <span><strong>Crescimento de Despesas Obrigatórias:</strong> Indexação de benefícios à Previdência e aumento do salário mínimo pressionam o espaço para investimentos.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-600 font-bold">•</span>
              <span><strong>Emendas Parlamentares (Pix / Comissão):</strong> Alto volume de emendas impositivas sem rastreabilidade adequada questionado pelo STF.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-rose-600 font-bold">•</span>
              <span><strong>Custo dos Juros da Dívida (SELIC):</strong> Despesa financeira de centenas de bilhões de reais ao ano para rolar a dívida pública.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Acompanhamento das Promessas de Campanha da Eleição Passada -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            Acompanhamento de Promessas de Campanha
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Verificação das promessas registradas e feitas nos debates da eleição de 2022.
          </p>
        </div>

        <!-- Filtros de Status de Promessa -->
        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            @click="promiseFilter = 'all'"
            :class="['px-3 py-1.5 rounded-lg transition-all', promiseFilter === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400']"
          >
            Todas ({{ evaluation.promisesList.length }})
          </button>
          <button
            @click="promiseFilter = 'cumprida'"
            :class="['px-3 py-1.5 rounded-lg transition-all', promiseFilter === 'cumprida' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 dark:text-emerald-400']"
          >
            Cumpridas
          </button>
          <button
            @click="promiseFilter = 'em_andamento'"
            :class="['px-3 py-1.5 rounded-lg transition-all', promiseFilter === 'em_andamento' ? 'bg-sky-600 text-white shadow-xs' : 'text-sky-700 dark:text-sky-400']"
          >
            Em Andamento
          </button>
          <button
            @click="promiseFilter = 'nao_cumprida'"
            :class="['px-3 py-1.5 rounded-lg transition-all', promiseFilter === 'nao_cumprida' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 dark:text-rose-400']"
          >
            Não Cumpridas
          </button>
        </div>
      </div>

      <!-- Barra e Contadores de Progresso -->
      <PromisesProgress :stats="evaluation.promisesStats" />

      <!-- Lista Detalhada de Promessas Filtradas -->
      <div class="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div
          v-for="promise in filteredPromises"
          :key="promise.id"
          class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ promise.category }}
            </span>

            <!-- Status Badge -->
            <span
              v-if="promise.status === 'cumprida'"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
              Cumprida
            </span>
            <span
              v-else-if="promise.status === 'em_andamento'"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
            >
              <Clock class="w-3.5 h-3.5 text-sky-600" />
              Em Andamento
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
            >
              <XCircle class="w-3.5 h-3.5 text-rose-600" />
              Não Cumprida
            </span>
          </div>

          <h4 class="text-sm font-bold text-slate-900 dark:text-white">
            {{ promise.title }}
          </h4>

          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ promise.details }}
          </p>

          <div class="pt-1 flex items-center justify-end">
            <a
              :href="promise.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <span>Ver Fonte Oficial</span>
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores Sociais e de Educação -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-xs space-y-6">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <GraduationCap class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Educação e Transferência de Renda</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Evolução do IDEB e orçamento de programas sociais no mandato</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- IDEB -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">Evolução do IDEB (Anos Iniciais)</h4>
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-center">
              <span class="text-2xl font-black">6.0</span>
              <span class="block text-[10px] font-bold">2023 (Atingiu Meta)</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O IDEB nacional dos anos iniciais do ensino fundamental atingiu a meta de 6,0 pontos estipulada pelo MEC, revertendo as perdas provocadas pelo fechamento das escolas durante a pandemia.
            </p>
          </div>
        </div>

        <!-- Programas Sociais -->
        <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">Orçamento Social & Famílias Atendidas</h4>
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-center">
              <span class="text-2xl font-black">20,8 mi</span>
              <span class="block text-[10px] font-bold">Famílias Atendidas</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Investimento anual superior a R$ 170 bilhões no Bolsa Família com média de R$ 680 por família e condicionalidades de vacinação e frequência escolar estrita.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
