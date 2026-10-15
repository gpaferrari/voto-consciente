<script setup lang="ts">
import { ref, computed } from 'vue';
import secondRoundDataRaw from '../data/second-round-2026.json';
import type { SecondRoundPoll, ProposalComparison, FirstRoundResult } from '../types/secondRound';
import { 
  Vote, 
  TrendingUp, 
  Scale, 
  ExternalLink, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  GraduationCap, 
  Coins, 
  Leaf, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-vue-next';

interface SecondRoundDataset {
  electionDateSecondRound: string;
  electionDateFirstRound: string;
  tseProclamationDate: string;
  firstRoundResults: FirstRoundResult[];
  pollsSecondRound: SecondRoundPoll[];
  aggregateAverage: {
    lulaValid: number;
    tarcisioValid: number;
    situation: string;
    updatedAt: string;
  };
  proposalsHeadToHead: ProposalComparison[];
}

const data = secondRoundDataRaw as unknown as SecondRoundDataset;

const selectedInstitute = ref<string>('todos');
const activeTheme = ref<string>('Economia & Renda');

const filteredPolls = computed(() => {
  if (selectedInstitute.value === 'todos') return data.pollsSecondRound;
  return data.pollsSecondRound.filter(p => p.institute === selectedInstitute.value);
});

const currentThemeComparison = computed(() => {
  return data.proposalsHeadToHead.find(p => p.theme === activeTheme.value) || data.proposalsHeadToHead[0];
});

function getThemeIcon(theme: string) {
  switch (theme) {
    case 'Economia & Renda': return TrendingUp;
    case 'Segurança Pública': return ShieldAlert;
    case 'Saúde & SUS': return Activity;
    case 'Educação': return GraduationCap;
    case 'Reforma Tributária & Fiscal': return Coins;
    case 'Meio Ambiente': return Leaf;
    default: return Scale;
  }
}

function formatDate(iso: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('pt-BR').format(num);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    <!-- Header Hero do 2º Turno -->
    <div class="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            DISPUTA DECISIVA &bull; 2º TURNO PRESIDENCIAL 2026
          </div>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Lula vs Tarcísio de Freitas
          </h1>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            Acompanhamento consolidado e apartidário das pesquisas de intenção de voto registradas no TSE,
            taxas de rejeição, migração de apoios do 1º turno e comparativo detalhado das propostas de governo.
          </p>
        </div>

        <!-- Card de Votação Oficial do 2º Turno -->
        <div class="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 text-center space-y-2 shrink-0 lg:w-72">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Data da Votação</span>
          <div class="text-2xl font-black text-white flex items-center justify-center gap-2">
            <Calendar class="w-5 h-5 text-emerald-400" />
            <span>25 de Outubro</span>
          </div>
          <p class="text-[11px] text-slate-400">
            Domingo &bull; Das 8h às 17h (Horário de Brasília)
          </p>
          <div class="pt-2 border-t border-slate-700 text-[10px] text-emerald-400 font-bold uppercase">
            Apuração em Tempo Real pelo TSE
          </div>
        </div>
      </div>

      <!-- Placar da Média Ponderada Agregada (Votos Válidos) -->
      <div class="pt-6 border-t border-slate-800 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span class="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Scale class="w-4 h-4 text-emerald-400" />
            Média Ponderada Agregada (Votos Válidos - TSE):
          </span>
          <span class="text-slate-400 font-mono text-[11px]">
            {{ data.aggregateAverage.situation }}
          </span>
        </div>

        <!-- Termômetro Barra de Votos Válidos -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-base font-extrabold">
            <div class="flex items-center gap-2 text-rose-400">
              <span class="w-3 h-3 rounded-full bg-rose-600"></span>
              <span>Lula (PT)</span>
              <span class="text-xl font-black">{{ data.aggregateAverage.lulaValid }}%</span>
            </div>
            <div class="flex items-center gap-2 text-blue-400">
              <span class="text-xl font-black">{{ data.aggregateAverage.tarcisioValid }}%</span>
              <span>Tarcísio (Rep/PL)</span>
              <span class="w-3 h-3 rounded-full bg-blue-600"></span>
            </div>
          </div>

          <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              class="h-full bg-rose-600 transition-all duration-500"
              :style="{ width: `${data.aggregateAverage.lulaValid}%` }"
              title="Lula"
            ></div>
            <div
              class="h-full bg-blue-600 transition-all duration-500"
              :style="{ width: `${data.aggregateAverage.tarcisioValid}%` }"
              title="Tarcísio de Freitas"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÃO 1: Pesquisas Oficiais Registradas no TSE pós-1º Turno -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Resolução TSE 23.600
            </span>
            <span class="text-xs text-slate-400 font-mono">Pós-1º Turno (Outubro/2026)</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Pesquisas Eleitorais de 2º Turno
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Apenas pesquisas oficiais com registro válido no sistema PesqEle do Tribunal Superior Eleitoral.
          </p>
        </div>

        <!-- Seletor de Instituto -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-500 font-bold">Instituto:</label>
          <select
            v-model="selectedInstitute"
            class="text-xs py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="todos">Todos os Institutos</option>
            <option value="Datafolha">Datafolha</option>
            <option value="Quaest">Quaest</option>
            <option value="AtlasIntel">AtlasIntel</option>
            <option value="Paraná Pesquisas">Paraná Pesquisas</option>
          </select>
        </div>
      </div>

      <!-- Tabela / Cards de Pesquisas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="poll in filteredPolls"
          :key="poll.id"
          class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-4"
        >
          <!-- Cabeçalho da Pesquisa -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-extrabold text-slate-900 dark:text-white">
                  {{ poll.institute }}
                </span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {{ poll.tseRegistration }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Divulgação: {{ formatDate(poll.releaseDate) }} &bull; Amostra: {{ formatNumber(poll.sampleSize) }} entrevistas
              </p>
            </div>

            <a
              :href="poll.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0 p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-600 transition-colors"
              title="Ver matéria original da pesquisa"
            >
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Comparativo Votos Válidos -->
          <div class="space-y-1.5 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Votos Válidos</span>
            <div class="flex items-center justify-between text-sm font-black">
              <span class="text-rose-600 dark:text-rose-400">Lula: {{ poll.validVotes.lula }}%</span>
              <span class="text-xs text-slate-400 font-mono">Margem &plusmn; {{ poll.marginOfError }}%</span>
              <span class="text-blue-600 dark:text-blue-400">Tarcísio: {{ poll.validVotes.tarcisio }}%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div class="h-full bg-rose-600" :style="{ width: `${poll.validVotes.lula}%` }"></div>
              <div class="h-full bg-blue-600" :style="{ width: `${poll.validVotes.tarcisio}%` }"></div>
            </div>
          </div>

          <!-- Votos Totais & Rejeição -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Votos Totais:</span>
              <div class="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                <div>Lula: <strong>{{ poll.totalVotes.lula }}%</strong></div>
                <div>Tarcísio: <strong>{{ poll.totalVotes.tarcisio }}%</strong></div>
                <div class="text-slate-400">Brancos/Nulos: {{ poll.totalVotes.blankNull }}%</div>
                <div class="text-slate-400">Indecisos: {{ poll.totalVotes.undecided }}%</div>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase">Taxa de Rejeição:</span>
              <div class="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                <div>Não votaria em Lula: <strong class="text-rose-500">{{ poll.rejection.lula }}%</strong></div>
                <div>Não votaria em Tarcísio: <strong class="text-blue-500">{{ poll.rejection.tarcisio }}%</strong></div>
              </div>
            </div>
          </div>

          <div class="text-[10px] text-slate-400 font-mono">
            Contratante: {{ poll.contractor }} &bull; Metodologia: {{ poll.methodology }}
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÃO 2: Resultado Oficial do 1º Turno (Histórico e Apoios) -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div class="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-500" />
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Apuração Final Concluída pelo TSE
          </span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Como Chegamos ao 2º Turno: Resultado Oficial do 1º Turno (04 de Outubro)
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Votação obtida por todos os candidatos a Presidente da República no 1º turno e a posição/apoio declarado para a decisão final.
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="cand in data.firstRoundResults"
          :key="cand.candidateId"
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all"
          :class="[
            cand.status === 'classificado_2_turno'
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80'
              : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
          ]"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-3 h-3 rounded-full shrink-0"
              :style="{ backgroundColor: cand.color }"
            ></span>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white">
                  {{ cand.popularName }}
                </h4>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {{ cand.party }}
                </span>
                <span
                  v-if="cand.status === 'classificado_2_turno'"
                  class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                >
                  Classificado para o 2º Turno
                </span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {{ cand.endorsement }}
              </p>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="text-sm font-black text-slate-900 dark:text-white">
              {{ cand.percentage }}%
            </span>
            <p class="text-[11px] text-slate-400 font-mono">
              {{ formatNumber(cand.votes) }} votos
            </p>
          </div>
        </div>
      </div>

      <!-- Apoios Declarados de Governadores Estaduais no 2º Turno -->
      <div v-if="(data as any).governorEndorsements" class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Articulação Federativa &bull; Posições Oficiais
          </span>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
            Posicionamento de Governadores Estaduais e Lideranças no 2º Turno
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Governadores em exercício nos estados e seus apoios declarados formalmente para a eleição presidencial:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="end in (data as any).governorEndorsements"
            :key="end.governorName"
            class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-white">
                  {{ end.governorName }}
                </h4>
                <span class="text-[10px] text-slate-500 dark:text-slate-400">
                  {{ end.state }} &bull; {{ end.party }}
                </span>
              </div>
              <span
                class="text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                :class="end.position.includes('Apoio a Tarcísio') ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
              >
                {{ end.position }}
              </span>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ end.pactThemes }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- SEÇÃO 3: Comparativo Direto de Propostas Frente a Frente -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div class="border-b border-slate-100 dark:border-slate-800 pb-4">
        <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          Comparação Temática Imparcial
        </span>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Propostas Frente a Frente: O que Cada Candidato Propõe para o País
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Compare as diretrizes registradas no TSE para cada área vital da administração federal.
        </p>
      </div>

      <!-- Abas de Temas -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="prop in data.proposalsHeadToHead"
          :key="prop.theme"
          @click="activeTheme = prop.theme"
          :class="[
            'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
            activeTheme === prop.theme
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          ]"
        >
          <component :is="getThemeIcon(prop.theme)" class="w-3.5 h-3.5" />
          <span>{{ prop.theme }}</span>
        </button>
      </div>

      <!-- Comparativo Lado a Lado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <!-- Lula -->
        <div class="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-3 border-b border-rose-200/80 dark:border-rose-900/40">
            <span class="w-3.5 h-3.5 rounded-full bg-rose-600"></span>
            <div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
                Luiz Inácio Lula da Silva (PT)
              </h3>
              <p class="text-xs text-rose-700 dark:text-rose-400 font-semibold">
                {{ currentThemeComparison.lulaProposal.title }}
              </p>
            </div>
          </div>

          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ currentThemeComparison.lulaProposal.description }}
          </p>

          <div class="space-y-2 pt-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pontos-Chave:</span>
            <ul class="space-y-1.5">
              <li
                v-for="(point, pIdx) in currentThemeComparison.lulaProposal.keyPoints"
                :key="pIdx"
                class="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-snug"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tarcísio de Freitas -->
        <div class="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-6 space-y-4">
          <div class="flex items-center gap-3 pb-3 border-b border-blue-200/80 dark:border-blue-900/40">
            <span class="w-3.5 h-3.5 rounded-full bg-blue-600"></span>
            <div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
                Tarcísio de Freitas (Republicanos / PL)
              </h3>
              <p class="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                {{ currentThemeComparison.tarcisioProposal.title }}
              </p>
            </div>
          </div>

          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {{ currentThemeComparison.tarcisioProposal.description }}
          </p>

          <div class="space-y-2 pt-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pontos-Chave:</span>
            <ul class="space-y-1.5">
              <li
                v-for="(point, pIdx) in currentThemeComparison.tarcisioProposal.keyPoints"
                :key="pIdx"
                class="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-snug"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
