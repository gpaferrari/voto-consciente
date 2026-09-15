<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PollSurvey, PollScenario } from '../../types/polling';

const props = defineProps<{
  polls: PollSurvey[];
  title?: string;
}>();

// Selected Scenario index or type
const selectedScenarioType = ref<'estimulada' | 'espontanea' | 'segundo_turno'>('estimulada');
const selectedCandidateHighlight = ref<string | null>(null);

// Extract available scenarios matching current filter
const activeSurveys = computed(() => {
  return [...props.polls].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
});

// Aggregate data points for the selected scenario type
const chartData = computed(() => {
  const points: {
    surveyId: string;
    institute: string;
    releaseDate: string;
    tseRegistration: string;
    marginOfError: number;
    scenarioTitle: string;
    results: { candidateId: string; candidateName: string; party: string; percentage: number; color: string }[];
    blankNull: number;
    undecided: number;
  }[] = [];

  for (const survey of activeSurveys.value) {
    const scenario = survey.scenarios.find(s => s.type === selectedScenarioType.value);
    if (scenario) {
      points.push({
        surveyId: survey.id,
        institute: survey.institute,
        releaseDate: survey.releaseDate,
        tseRegistration: survey.tseRegistration,
        marginOfError: survey.marginOfError,
        scenarioTitle: scenario.title,
        results: scenario.results.map(r => ({
          ...r,
          color: r.color || '#3b82f6'
        })),
        blankNull: scenario.blankNull,
        undecided: scenario.undecided
      });
    }
  }

  return points;
});

// All unique candidates in current chartData
const candidateLegend = computed(() => {
  const map = new Map<string, { name: string; party: string; color: string }>();
  for (const pt of chartData.value) {
    for (const r of pt.results) {
      if (!map.has(r.candidateId)) {
        map.set(r.candidateId, { name: r.candidateName, party: r.party, color: r.color });
      }
    }
  }
  return Array.from(map.entries()).map(([id, info]) => ({
    id,
    ...info
  }));
});

// SVG Chart dimensions
const svgWidth = 720;
const svgHeight = 320;
const padding = { top: 30, right: 40, bottom: 50, left: 50 };

const innerWidth = svgWidth - padding.left - padding.right;
const innerHeight = svgHeight - padding.top - padding.bottom;

// Max percentage for scale (usually 50% or 60%)
const maxY = computed(() => {
  let max = 40;
  for (const pt of chartData.value) {
    for (const r of pt.results) {
      if (r.percentage > max) max = Math.ceil(r.percentage / 10) * 10;
    }
  }
  return Math.min(100, max + 10);
});

// Coordinates calculation
const getX = (index: number) => {
  if (chartData.value.length <= 1) return padding.left + innerWidth / 2;
  return padding.left + (index / (chartData.value.length - 1)) * innerWidth;
};

const getY = (val: number) => {
  return padding.top + innerHeight - (val / maxY.value) * innerHeight;
};

// Generate SVG polyline points for a candidate
const getPolylinePoints = (candidateId: string) => {
  return chartData.value
    .map((pt, idx) => {
      const res = pt.results.find(r => r.candidateId === candidateId);
      if (!res) return null;
      return `${getX(idx)},${getY(res.percentage)}`;
    })
    .filter(Boolean)
    .join(' ');
};

// Hovered point detail state
const hoveredPoint = ref<{
  candidateName: string;
  party: string;
  percentage: number;
  institute: string;
  tseRegistration: string;
  date: string;
  margin: number;
  x: number;
  y: number;
} | null>(null);

const formatDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};
</script>

<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors shadow-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Série Histórica TSE
          </span>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-1">
          {{ title || 'Evolução da Intenção de Voto' }}
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pesquisas com registro oficial no TSE (Datafolha, Quaest, Paraná Pesquisas, AtlasIntel)
        </p>
      </div>

      <!-- Cenários Selector -->
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium self-start sm:self-auto">
        <button
          type="button"
          @click="selectedScenarioType = 'estimulada'"
          :class="[
            'px-3 py-1.5 rounded-md transition-all',
            selectedScenarioType === 'estimulada'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          ]"
        >
          Estimulada 1ºT
        </button>
        <button
          type="button"
          @click="selectedScenarioType = 'espontanea'"
          :class="[
            'px-3 py-1.5 rounded-md transition-all',
            selectedScenarioType === 'espontanea'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          ]"
        >
          Espontânea
        </button>
        <button
          type="button"
          @click="selectedScenarioType = 'segundo_turno'"
          :class="[
            'px-3 py-1.5 rounded-md transition-all',
            selectedScenarioType === 'segundo_turno'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          ]"
        >
          2º Turno
        </button>
      </div>
    </div>

    <!-- Candidate Filter & Interactive Legend -->
    <div class="flex flex-wrap items-center gap-2 pt-4 pb-2">
      <button
        v-for="cand in candidateLegend"
        :key="cand.id"
        @click="selectedCandidateHighlight = selectedCandidateHighlight === cand.id ? null : cand.id"
        class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
        :class="[
          selectedCandidateHighlight === cand.id
            ? 'border-slate-900 dark:border-white ring-2 ring-slate-400/30'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-400',
          selectedCandidateHighlight && selectedCandidateHighlight !== cand.id ? 'opacity-40' : 'opacity-100'
        ]"
      >
        <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cand.color }"></span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold">{{ cand.name }}</span>
        <span class="text-slate-400 text-[10px]">({{ cand.party }})</span>
      </button>

      <button
        v-if="selectedCandidateHighlight"
        @click="selectedCandidateHighlight = null"
        class="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-2"
      >
        Limpar destaque
      </button>
    </div>

    <!-- Chart Container -->
    <div class="relative w-full overflow-x-auto my-3">
      <svg
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="w-full h-auto min-w-[500px] select-none"
      >
        <!-- Horizontal grid lines -->
        <g stroke="currentColor" class="text-slate-100 dark:text-slate-800" stroke-width="1">
          <line
            v-for="val in [10, 20, 30, 40, 50, 60]"
            :key="val"
            :x1="padding.left"
            :y1="getY(val)"
            :x2="svgWidth - padding.right"
            :y2="getY(val)"
            stroke-dasharray="3,3"
          />
        </g>

        <!-- Y Axis Labels -->
        <g class="text-[10px] font-mono fill-slate-400">
          <text
            v-for="val in [10, 20, 30, 40, 50, 60]"
            :key="val"
            :x="padding.left - 8"
            :y="getY(val) + 3"
            text-anchor="end"
          >
            {{ val }}%
          </text>
        </g>

        <!-- X Axis Dates & Institute Labels -->
        <g class="text-[10px] fill-slate-400">
          <g v-for="(pt, idx) in chartData" :key="pt.surveyId">
            <text :x="getX(idx)" :y="svgHeight - padding.bottom + 18" text-anchor="middle" class="font-medium fill-slate-700 dark:fill-slate-300">
              {{ pt.institute }}
            </text>
            <text :x="getX(idx)" :y="svgHeight - padding.bottom + 32" text-anchor="middle" class="fill-slate-400 text-[9px] font-mono">
              {{ formatDate(pt.releaseDate) }}
            </text>
          </g>
        </g>

        <!-- Trend Lines per candidate -->
        <g v-for="cand in candidateLegend" :key="cand.id">
          <!-- Main Line -->
          <polyline
            :points="getPolylinePoints(cand.id)"
            fill="none"
            :stroke="cand.color"
            :stroke-width="selectedCandidateHighlight === cand.id ? 3.5 : 2.5"
            :stroke-opacity="selectedCandidateHighlight && selectedCandidateHighlight !== cand.id ? 0.2 : 0.95"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="transition-all duration-200"
          />

          <!-- Dots -->
          <g v-for="(pt, idx) in chartData" :key="`${cand.id}-${idx}`">
            <template v-for="r in pt.results.filter(x => x.candidateId === cand.id)" :key="r.candidateId">
              <!-- Clickable/Hoverable Dot -->
              <circle
                :cx="getX(idx)"
                :cy="getY(r.percentage)"
                :r="selectedCandidateHighlight === cand.id ? 5 : 4"
                :fill="cand.color"
                stroke="white"
                stroke-width="2"
                class="cursor-pointer transition-transform hover:scale-150"
                :opacity="selectedCandidateHighlight && selectedCandidateHighlight !== cand.id ? 0.25 : 1"
                @mouseenter="hoveredPoint = {
                  candidateName: cand.name,
                  party: cand.party,
                  percentage: r.percentage,
                  institute: pt.institute,
                  tseRegistration: pt.tseRegistration,
                  date: pt.releaseDate,
                  margin: pt.marginOfError,
                  x: getX(idx),
                  y: getY(r.percentage)
                }"
                @mouseleave="hoveredPoint = null"
              />
            </template>
          </g>
        </g>

        <!-- Hover Indicator Floating Tooltip (SVG based or anchored) -->
      </svg>

      <!-- Active Tooltip Box -->
      <div
        v-if="hoveredPoint"
        class="absolute pointer-events-none z-10 bg-slate-900 text-white text-xs rounded-lg shadow-xl px-3 py-2 border border-slate-700 transition-all transform -translate-x-1/2 -translate-y-full mb-3"
        :style="{
          left: `${(hoveredPoint.x / svgWidth) * 100}%`,
          top: `${(hoveredPoint.y / svgHeight) * 100}%`
        }"
      >
        <div class="flex items-center justify-between gap-3 font-semibold pb-1 border-b border-slate-700">
          <span>{{ hoveredPoint.candidateName }} ({{ hoveredPoint.party }})</span>
          <span class="text-emerald-400 font-mono text-sm">{{ hoveredPoint.percentage }}%</span>
        </div>
        <div class="pt-1.5 space-y-0.5 text-[11px] text-slate-300">
          <p><strong class="text-slate-100">{{ hoveredPoint.institute }}</strong> em {{ formatDate(hoveredPoint.date) }}</p>
          <p class="font-mono text-[10px] text-slate-400">TSE: {{ hoveredPoint.tseRegistration }} (± {{ hoveredPoint.margin }} p.p.)</p>
        </div>
      </div>
    </div>

    <!-- Empty state if no data for scenario -->
    <div v-if="chartData.length === 0" class="py-12 text-center text-slate-400 text-sm">
      Nenhum dado registrado para este formato de cenário nos levantamentos atuais.
    </div>

    <!-- Legal disclaimer footer of the chart -->
    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
      <div class="flex items-center gap-1.5">
        <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Compilação informativa de pesquisas já divulgadas e registradas no TSE conforme <strong>Resolução nº 23.600/2019</strong>. Não constitui enquete ou pesquisa própria.
        </span>
      </div>
      <a
        href="https://www.tse.jus.br/eleicoes/pesquisas-eleitorais/consulta-as-pesquisas-registradas"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold underline"
      >
        Consultar PesqEle / TSE &rarr;
      </a>
    </div>
  </div>
</template>
