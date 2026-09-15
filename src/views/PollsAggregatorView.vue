<script setup lang="ts">
import { ref, computed } from 'vue';
import PollingTrackerChart from '../components/polls/PollingTrackerChart.vue';
import presidentialPollsData from '../data/polls/presidential-polls.json';
import spPollsData from '../data/polls/sp-polls.json';
import type { PollSurvey } from '../types/polling';

const activeTab = ref<'presidente' | 'governador'>('presidente');
const selectedInstituteFilter = ref<string>('todos');

const presidentialPolls = presidentialPollsData as unknown as PollSurvey[];
const spPolls = spPollsData as unknown as PollSurvey[];

const currentPolls = computed(() => {
  const list = activeTab.value === 'presidente' ? presidentialPolls : spPolls;
  if (selectedInstituteFilter.value === 'todos') return list;
  return list.filter(p => p.institute === selectedInstituteFilter.value);
});

// Unique institutes in the current office
const availableInstitutes = computed(() => {
  const list = activeTab.value === 'presidente' ? presidentialPolls : spPolls;
  return Array.from(new Set(list.map(p => p.institute)));
});

// Latest Poll Highlight
const latestPoll = computed(() => {
  const sorted = [...currentPolls.value].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  return sorted[0] || null;
});

const formatDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="flex items-center gap-2 mb-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Dados Oficiais Registrados
        </span>
        <span class="text-xs text-slate-500 font-mono">TSE / Res. 23.600</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Agregador de Pesquisas Eleitorais 2026
      </h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        Acompanhamento consolidado e imparcial das pesquisas de intenção de voto divulgadas pelos principais institutos do país.
        Todas as pesquisas contêm obrigatoriamente número de registro no TSE, contratante, margem de erro e metodologia detalhada.
      </p>
    </div>

    <!-- Office Selector & Filters Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- Office Tabs -->
      <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          @click="activeTab = 'presidente'; selectedInstituteFilter = 'todos'"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'presidente'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          🇧🇷 Presidente da República
        </button>
        <button
          type="button"
          @click="activeTab = 'governador'; selectedInstituteFilter = 'todos'"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'governador'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          🏙️ Governador de SP
        </button>
      </div>

      <!-- Institute Filter -->
      <div class="flex items-center gap-2">
        <label class="text-xs text-slate-500 font-medium">Filtrar Instituto:</label>
        <select
          v-model="selectedInstituteFilter"
          class="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
        >
          <option value="todos">Todos os Institutos</option>
          <option v-for="inst in availableInstitutes" :key="inst" :value="inst">
            {{ inst }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Chart Component -->
    <PollingTrackerChart
      :polls="currentPolls"
      :title="activeTab === 'presidente' ? 'Evolução Presidencial 2026' : 'Evolução Governo do Estado de SP 2026'"
    />

    <!-- Highlight Card: Latest Survey Overview -->
    <div v-if="latestPoll" class="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span class="text-[11px] uppercase tracking-wider font-bold text-slate-500">Último Levantamento Publicado</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
            {{ latestPoll.institute }} &bull; Divulgada em {{ formatDate(latestPoll.releaseDate) }}
          </h2>
          <p class="text-xs text-slate-500 font-mono mt-0.5">
            Registro TSE: <span class="font-bold text-slate-700 dark:text-slate-300">{{ latestPoll.tseRegistration }}</span> &bull;
            Amostra: {{ latestPoll.sampleSize.toLocaleString('pt-BR') }} entrevistas &bull;
            Margem: &plusmn; {{ latestPoll.marginOfError }} p.p.
          </p>
        </div>
        <div class="text-right shrink-0">
          <span class="text-xs text-slate-500 block">Contratante:</span>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">{{ latestPoll.contractor }}</span>
        </div>
      </div>

      <!-- Scenarios Grid in Latest Poll -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          v-for="sc in latestPoll.scenarios"
          :key="sc.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {{ sc.title }}
            </h4>
            <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {{ sc.type }}
            </span>
          </div>

          <div class="space-y-2.5">
            <div v-for="res in sc.results" :key="res.candidateId">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ res.candidateName }} ({{ res.party }})</span>
                <span class="font-bold font-mono text-slate-900 dark:text-white">{{ res.percentage }}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: `${res.percentage}%`, backgroundColor: res.color || '#3b82f6' }"
                ></div>
              </div>
            </div>

            <!-- Brancos/Nulos/Indecisos -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 text-[11px] text-slate-500">
              <div>Brancos / Nulos: <strong class="text-slate-700 dark:text-slate-300">{{ sc.blankNull }}%</strong></div>
              <div class="text-right">Indecisos / NS: <strong class="text-slate-700 dark:text-slate-300">{{ sc.undecided }}%</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Registered Polls Table -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Tabela de Pesquisas Registradas no TSE
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Registro formal auditável perante a Justiça Eleitoral brasileira
          </p>
        </div>
        <span class="text-xs font-mono text-slate-400">
          {{ currentPolls.length }} levantamento(s)
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th class="px-6 py-3">Instituto</th>
              <th class="px-6 py-3">Registro TSE</th>
              <th class="px-6 py-3">Período de Campo</th>
              <th class="px-6 py-3">Divulgação</th>
              <th class="px-6 py-3">Amostra</th>
              <th class="px-6 py-3">Margem</th>
              <th class="px-6 py-3">Metodologia</th>
              <th class="px-6 py-3 text-right">Fonte</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-for="p in currentPolls" :key="p.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
                {{ p.institute }}
              </td>
              <td class="px-6 py-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                {{ p.tseRegistration }}
              </td>
              <td class="px-6 py-4 font-mono text-slate-500">
                {{ formatDate(p.fieldStartDate) }} a {{ formatDate(p.fieldEndDate) }}
              </td>
              <td class="px-6 py-4 font-mono">
                {{ formatDate(p.releaseDate) }}
              </td>
              <td class="px-6 py-4">
                {{ p.sampleSize.toLocaleString('pt-BR') }} ent.
              </td>
              <td class="px-6 py-4 font-mono">
                &plusmn; {{ p.marginOfError }} p.p.
              </td>
              <td class="px-6 py-4 text-slate-500 max-w-xs truncate">
                {{ p.methodology }}
              </td>
              <td class="px-6 py-4 text-right">
                <a
                  :href="p.sourceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                >
                  Relatório &rarr;
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Educational Guide: Margin of Error & Methodology -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-850/50">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <span>📐 O que é Empate Técnico?</span>
        </h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Ocorre quando a diferença entre dois candidatos é menor ou igual à soma das suas margens de erro. Por exemplo, com margem de 2 p.p., um candidato com 38% pode variar de 36% a 40%, enquanto outro com 35% pode variar de 33% a 37%. As faixas se sobrepõem entre 36% e 37%, caracterizando empate na probabilidade estatística de 95%.
        </p>
      </div>

      <div class="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-850/50">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚖️ Rigor Legal e Compliance</span>
        </h4>
        <p class="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          O portal <strong>Voto Consciente</strong> não realiza enquetes virtuais nem pesquisas próprias (em obediência ao Art. 33 da Lei 9.504/97). Os dados acima são exclusivamente agregações de relatórios públicos de empresas credenciadas que cumpriram todos os requisitos e prazos de registro no sistema PesqEle do Tribunal Superior Eleitoral.
        </p>
      </div>
    </div>
  </div>
</template>
