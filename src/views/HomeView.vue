<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCandidateStore } from '../stores/candidateStore';
import CandidateCard from '../components/candidate/CandidateCard.vue';
import ScoreGauge from '../components/shared/ScoreGauge.vue';
import LiveNewsFeed from '../components/candidate/LiveNewsFeed.vue';
import { 
  Vote, 
  ShieldCheck, 
  ActivitySquare, 
  ArrowRight, 
  Scale, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  BarChart3, 
  CheckCircle2, 
  MapPin, 
  Building2,
  Award,
  Flame
} from 'lucide-vue-next';

const router = useRouter();
const store = useCandidateStore();

const topCandidates = computed(() => {
  return [...store.scoredCandidates]
    .sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore)
    .slice(0, 3);
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 md:space-y-10 min-w-0 overflow-x-hidden">
    <!-- Hero Section Otimizado (Clean SaaS / Notion Style) -->
    <section class="relative py-6 md:py-10 overflow-hidden rounded-3xl bg-linear-to-b from-slate-100/60 to-white dark:from-slate-900/60 dark:to-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8">
      <!-- Glow de fundo contido -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 blur-3xl -z-10 pointer-events-none rounded-full"></div>

      <div class="max-w-4xl mx-auto text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles class="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>ELEIÇÕES CONSCIENTES & TRANSPARENTES 2026</span>
        </div>

        <h1 class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
          Decida seu voto com base em <span class="bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">Fatos Reais</span> e Dados Oficiais.
        </h1>

        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sem polarização cega, sem boatos de redes sociais. Uma plataforma cívica apartidária que audita escolaridade, experiência pública, sabatinas, planos de governo registrados no TSE e metas do mandato atual.
        </p>

        <!-- Ações do Hero -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            @click="router.push('/segundo-turno')"
            class="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/20 hover:shadow-rose-600/30 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>2º Turno Presidencial 2026</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            @click="router.push('/eleitos')"
            class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Eleitos 2026 & Propostas (27 UFs)</span>
          </button>

          <button
            @click="router.push('/pesquisas')"
            class="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 class="w-4 h-4 text-blue-500" />
            <span>Pesquisas TSE</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Destaques Especiais das Eleições 2026 (2º Turno & Eleitos) -->
    <section class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Card 1: 2º Turno Presidencial -->
        <div
          @click="router.push('/segundo-turno')"
          class="relative overflow-hidden bg-linear-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 hover:border-rose-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between space-y-4"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                VOTAÇÃO 25 DE OUTUBRO
              </span>
              <span class="text-xs text-slate-400 font-mono">TSE Oficial</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
              Disputa do 2º Turno Presidencial: Flávio Bolsonaro vs Lula
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulte as pesquisas eleitorais registradas no TSE em Outubro/2026 (Datafolha, Quaest, CNT/MDA, Futura), resultado oficial do 1º turno (47,03% x 45,16%), apoios de governadores e o comparativo direto de propostas.
            </p>
          </div>

          <!-- Placar Rápido Agregado -->
          <div class="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-blue-400">Flávio Bolsonaro (PL): 50,9%</span>
              <span class="text-slate-400 font-mono text-[10px]">Votos Válidos (Empate Técnico)</span>
              <span class="text-rose-400">Lula (PT): 49,1%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden flex">
              <div class="h-full bg-blue-600 transition-all" style="width: 50.9%"></div>
              <div class="h-full bg-rose-600 transition-all" style="width: 49.1%"></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Acessar Painel Completo do 2º Turno</span>
            <ArrowRight class="w-4 h-4" />
          </div>
        </div>

        <!-- Card 2: Eleitos 2026 em Todos os Estados -->
        <div
          @click="router.push('/eleitos')"
          class="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
                RESULTADO DO 1º TURNO PROCLAMADO
              </span>
              <span class="text-xs text-slate-400 font-mono">27 UFs</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Candidatos Eleitos 2026 & Suas Propostas
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consulte governadores eleitos, novos senadores (2 vagas por estado renovadas) e bancadas federais de todos os 26 estados e DF, com suas metas e compromissos registrados para 2027-2030.
            </p>
          </div>

          <!-- Destaque Rápido de Estados -->
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cobertura Nacional Completa:</span>
            <div class="flex flex-wrap gap-1 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">SP</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">RJ</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">MG</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">BA</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">PR</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">RS</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">+ 21 Estados</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Ver Lista de Eleitos e Propostas</span>
            <ArrowRight class="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>

    <!-- Seletor Rápido de Cargos -->
    <section class="w-full">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Navegar por Cargos em Disputa
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Esferas executiva e legislativa federal e estadual
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- 1. Presidente -->
        <div
          @click="navigateToRole('presidente')"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Vote class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Presidente da República
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Plano econômico, segurança nacional e metas federais.
              </p>
            </div>
          </div>
          <div class="pt-3 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 2. Governador SP -->
        <div
          @click="navigateToRole('governador_sp')"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-sky-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <TrendingUp class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Governador de SP
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Segurança pública, saúde, trens, metrô e educação estadual.
              </p>
            </div>
          </div>
          <div class="pt-3 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 3. Senador SP -->
        <div
          @click="navigateToRole('senador')"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-purple-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Award class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Senador por São Paulo
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Mandato de 8 anos, sabatinas de ministros do STF e pacto federativo.
              </p>
            </div>
          </div>
          <div class="pt-3 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <!-- 4. Deputados Bauru -->
        <div
          @click="navigateToRole('deputado_federal_bauru')"
          class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div class="space-y-2.5">
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Scale class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Deputados (Bauru)
                </h3>
                <span class="text-[9px] px-1.5 py-0.2 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">LOCAL</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Representação parlamentar da região centro-oeste paulista e emendas.
              </p>
            </div>
          </div>
          <div class="pt-3 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Avaliar Candidatos</span>
            <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>

    <!-- Top Candidatos em Destaque (Score Geral Auditado) -->
    <section class="w-full space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Metodologia Transparente
          </span>
          <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            Candidatos com Maior Aptidão (Score Geral)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Ranking auditável baseado nos pesos atuais de escolaridade, experiência, sabatinas e integridade.
          </p>
        </div>

        <button
          @click="router.push('/presidente')"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <span>Ver Lista Completa</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CandidateCard
          v-for="candidate in topCandidates"
          :key="candidate.id"
          :candidate="candidate"
        />
      </div>
    </section>

    <!-- Banner Especial: Auditoria do Mandato Atual -->
    <section v-if="currentPresident && currentPresident.mandateEvaluation" class="w-full">
      <div class="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl overflow-hidden relative">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div class="space-y-2.5 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider">
                Módulo Especial de Prestação de Contas
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black">
              Como foi o Mandato do Presidente Atual?
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Examinamos se o presidente cumpriu as promessas da campanha anterior, se a economia cresceu (PIB), o comportamento da inflação (IPCA), os gastos públicos e os programas sociais.
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span>📊 <strong>{{ currentPresident.mandateEvaluation.promisesStats.fulfilled }}</strong> promessas cumpridas</span>
              <span>📈 PIB médio <strong>> 2,8%</strong> a.a.</span>
              <span>📉 Menor desemprego em 10 anos</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center gap-3.5">
              <ScoreGauge :score="currentPresident.mandateEvaluation.mandateScore" size="md" subtitle="Score Mandato" />
              <div class="text-left">
                <span class="text-[11px] font-semibold text-slate-400 block">Avaliação Geral</span>
                <span class="text-base font-bold text-white block">Mandato 2023-2026</span>
                <span class="text-[10px] text-emerald-400 font-medium">Contas e Dados Oficiais</span>
              </div>
            </div>

            <button
              @click="router.push('/mandato-atual')"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <span>Acessar Auditoria Completa</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner Agregador de Pesquisas Registradas no TSE -->
    <section class="w-full">
      <div class="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-blue-800 shadow-xl overflow-hidden relative">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div class="space-y-2 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                Módulo Oficial de Intenção de Voto
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black">
              Agregador de Pesquisas Eleitorais 2026 (TSE)
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulte séries históricas e comparações entre levantamentos de institutos registrados na Justiça Eleitoral (Datafolha, Quaest, Paraná Pesquisas e AtlasIntel). Acompanhe cenários de 1º e 2º turnos com margens de erro auditáveis.
            </p>
          </div>

          <button
            @click="router.push('/pesquisas')"
            class="px-5 py-3 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 self-start md:self-center cursor-pointer"
          >
            <BarChart3 class="w-4 h-4 text-blue-600" />
            <span>Ver Pesquisas & Séries Históricas</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>

    <!-- Notícias em Tempo Real & Cobertura da Imprensa -->
    <section class="w-full">
      <LiveNewsFeed :limit="6" />
    </section>

    <!-- Como Funciona o Score (5 Pilares) -->
    <section class="w-full">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-1.5">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Como Avaliamos
          </span>
          <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Os 5 Pilares do Voto Consciente
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Cada dimensão possui critérios matemáticos e auditáveis. Você tem o poder de mudar os pesos no menu lateral ou superior para refletir suas prioridades cívicas.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          <!-- 1 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
              <GraduationCap class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">1. Escolaridade</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Grau acadêmico oficial no TSE, diplomas e formação continuada.
            </p>
          </div>

          <!-- 2 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <Briefcase class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">2. Experiência</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tempo em cargos públicos, entregas de mandato e histórico de gestão.
            </p>
          </div>

          <!-- 3 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
              <TrendingUp class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">3. Sabatinas</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Consistência em debates, entrevistas e checagem de veracidade de falas.
            </p>
          </div>

          <!-- 4 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">4. Integridade</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Ficha Limpa, certidões negativas de tribunais e fact-checking.
            </p>
          </div>

          <!-- 5 -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
              <Scale class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">5. Plano de Gov.</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Propostas registradas no TSE com metas objetivas e fontes orçamentárias.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
