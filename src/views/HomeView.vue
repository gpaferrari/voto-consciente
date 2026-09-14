<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCandidateStore } from '../stores/candidateStore';
import CandidateCard from '../components/candidate/CandidateCard.vue';
import ScoreGauge from '../components/shared/ScoreGauge.vue';
import { 
  Vote, 
  ShieldCheck, 
  ActivitySquare, 
  ArrowRight, 
  Scale, 
  GraduationCap, 
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-vue-next';

const router = useRouter();
const store = useCandidateStore();

const topCandidates = computed(() => {
  return store.scoredCandidates.slice(0, 3);
});

const currentPresident = computed(() => store.currentPresident);

function navigateToRole(role: string) {
  if (role === 'presidente') router.push('/presidente');
  else if (role === 'governador_sp') router.push('/governador-sp');
  else if (role === 'senador') router.push('/senador');
  else if (role === 'deputado_federal_bauru') router.push('/deputados-bauru');
}
</script>

<template>
  <div class="space-y-16 pb-12">
    <!-- Hero Section -->
    <section class="relative pt-8 pb-12 md:pt-16 md:pb-20 overflow-hidden">
      <!-- Glow de fundo -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-linear-to-r from-emerald-500/15 via-teal-500/10 to-sky-500/15 blur-3xl -z-10 pointer-events-none rounded-full"></div>

      <div class="max-w-4xl mx-auto text-center space-y-6 px-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide animate-pulse">
          <Sparkles class="w-3.5 h-3.5" />
          <span>ELEIÇÕES CONSCIENTES & TRANSPARENTES</span>
        </div>

        <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Decida seu voto com base em <span class="bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">Fatos Reais</span> e Dados Oficiais.
        </h1>

        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sem polarização cega, sem boatos de WhatsApp. Uma plataforma apartidária que avalia escolaridade, experiência, sabatinas, planos de governo e auditoria do mandato atual.
        </p>

        <!-- Ações do Hero -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            @click="router.push('/presidente')"
            class="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center gap-2 group"
          >
            <span>Ver Candidatos a Presidente</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            @click="router.push('/mandato-atual')"
            class="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
          >
            <ActivitySquare class="w-4 h-4 text-sky-500" />
            <span>Auditoria do Mandato Atual</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Seletor Rápido de Cargos -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Escolha o Cargo para Avaliar
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Navegue pelas esferas executiva e legislativa federal e paulista
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Presidente -->
        <div
          @click="navigateToRole('presidente')"
          class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Vote class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Presidente da República
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Plano econômico, relações exteriores, segurança nacional e metas federais.
              </p>
            </div>
          </div>
          <div class="pt-4 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 2. Governador SP -->
        <div
          @click="navigateToRole('governador_sp')"
          class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-sky-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <TrendingUp class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Governador de SP
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Polícias Militar e Civil, rede estadual de ensino, trens, metrô e hospitais.
              </p>
            </div>
          </div>
          <div class="pt-4 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 3. Senador SP -->
        <div
          @click="navigateToRole('senador')"
          class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Award class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Senador por São Paulo
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Mandato de 8 anos, aprovação de ministros do STF e pacto federativo.
              </p>
            </div>
          </div>
          <div class="pt-4 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 4. Deputados Bauru -->
        <div
          @click="navigateToRole('deputado_federal_bauru')"
          class="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-lg hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Scale class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Deputados (Bauru)
                </h3>
                <span class="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">LOCAL</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Representação parlamentar da região centro-oeste paulista e emendas.
              </p>
            </div>
          </div>
          <div class="pt-4 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>

    <!-- Banner Especial: Auditoria do Mandato Atual -->
    <section v-if="currentPresident && currentPresident.mandateEvaluation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div class="space-y-3 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                Módulo Especial de Prestação de Contas
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black">
              Como foi o Mandato do Presidente Atual?
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Examinamos se o presidente cumpriu as promessas da campanha anterior, se a economia cresceu (PIB), o comportamento da inflação (IPCA), os gastos públicos e os programas sociais.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span>📊 <strong>{{ currentPresident.mandateEvaluation.promisesStats.fulfilled }}</strong> promessas cumpridas</span>
              <span>📈 PIB médio <strong>> 2,8%</strong> a.a.</span>
              <span>📉 Menor desemprego em 10 anos</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
              <ScoreGauge :score="currentPresident.mandateEvaluation.mandateScore" size="md" subtitle="Score Mandato" />
              <div class="text-left">
                <span class="text-xs font-semibold text-slate-400 block">Avaliação Geral</span>
                <span class="text-lg font-bold text-white block">Mandato 2023-2026</span>
                <span class="text-[11px] text-emerald-400 font-medium">Contas e Dados Oficiais</span>
              </div>
            </div>

            <button
              @click="router.push('/mandato-atual')"
              class="w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
            >
              <span>Acessar Auditoria Completa</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Candidatos em Destaque -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Metodologia Transparente
          </span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Candidatos com Maior Aptidão (Score Geral)
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ranking auditável baseado nos pesos atuais de escolaridade, experiência, sabatinas e integridade.
          </p>
        </div>

        <button
          @click="router.push('/presidente')"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>Ver Lista Completa</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CandidateCard
          v-for="candidate in topCandidates"
          :key="candidate.id"
          :candidate="candidate"
        />
      </div>
    </section>

    <!-- Como Funciona o Score (Explicação Metodológica Transparente) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-8">
        <div class="text-center max-w-2xl mx-auto space-y-2">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Como Avaliamos
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Os 5 Pilares do Voto Consciente
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Cada dimensão possui critérios matemáticos e auditáveis. Você tem o poder de mudar os pesos no menu superior para refletir suas convicções.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- 1 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <GraduationCap class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">1. Escolaridade</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Grau acadêmico oficial no TSE, diplomas e especializações em gestão pública.
            </p>
          </div>

          <!-- 2 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <Briefcase class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">2. Experiência</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tempo em cargos públicos, entregas de mandato e produtividade parlamentar.
            </p>
          </div>

          <!-- 3 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
              <TrendingUp class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">3. Sabatinas</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Desempenho em entrevistas, consistência e taxa de veracidade das falas.
            </p>
          </div>

          <!-- 4 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">4. Integridade</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Ficha Limpa, certidões negativas de tribunais e checagens factuais da mídia.
            </p>
          </div>

          <!-- 5 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <Scale class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">5. Plano de Gov.</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Propostas registradas no TSE, metas objetivas e fontes de recursos declaradas.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
