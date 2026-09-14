<script setup lang="ts">
import { ref, computed } from 'vue';

interface TrendPoint {
  year: number;
  value: number;
  benchmark?: number;
  label?: string;
}

const props = defineProps<{
  pibData: TrendPoint[];
  inflationData: TrendPoint[];
  unemploymentData: TrendPoint[];
  debtData: TrendPoint[];
  fiscalData: TrendPoint[];
}>();

const activeTab = ref<'pib' | 'inflation' | 'unemployment' | 'debt' | 'fiscal'>('pib');
const hoveredPoint = ref<{ point: TrendPoint; x: number; y: number } | null>(null);

const activeConfig = computed(() => {
  switch (activeTab.value) {
    case 'pib':
      return {
        title: 'Crescimento do PIB (% ao ano)',
        source: 'IBGE / Sistema de Contas Nacionais',
        unit: '%',
        data: props.pibData,
        color: '#10b981', // Emerald
        fillColor: 'rgba(16, 185, 129, 0.12)',
        description: 'Variação percentual real do volume do Produto Interno Bruto brasileiro.'
      };
    case 'inflation':
      return {
        title: 'Inflação Oficial (IPCA acumulado no ano)',
        source: 'IBGE / Banco Central do Brasil (SGS)',
        unit: '%',
        data: props.inflationData,
        color: '#0284c7', // Sky
        fillColor: 'rgba(2, 132, 199, 0.12)',
        description: 'Índice Nacional de Preços ao Consumidor Amplo e meta contínua do CMN.'
      };
    case 'unemployment':
      return {
        title: 'Taxa de Desocupação / Desemprego (%)',
        source: 'IBGE / PNAD Contínua',
        unit: '%',
        data: props.unemploymentData,
        color: '#8b5cf6', // Purple
        fillColor: 'rgba(139, 92, 246, 0.12)',
        description: 'Percentual de pessoas desocupadas na força de trabalho em âmbito nacional.'
      };
    case 'debt':
      return {
        title: 'Dívida Bruta do Governo Geral (% do PIB)',
        source: 'Banco Central do Brasil / Tesouro Nacional',
        unit: '%',
        data: props.debtData,
        color: '#f59e0b', // Amber
        fillColor: 'rgba(245, 158, 11, 0.12)',
        description: 'Total das obrigações financeiras do setor público consolidado em relação ao PIB.'
      };
    case 'fiscal':
      return {
        title: 'Resultado Primário do Governo Central',
        source: 'Tesouro Transparente / Secretaria do Tesouro Nacional',
        unit: 'R$ bi',
        data: props.fiscalData,
        color: '#ec4899', // Pink
        fillColor: 'rgba(236, 72, 153, 0.12)',
        description: 'Diferença entre receitas e despesas do Governo Federal (excluídos juros da dívida).'
      };
  }
});

const width = 560;
const height = 240;
const padding = { top: 30, right: 35, bottom: 40, left: 50 };

const currentPoints = computed(() => activeConfig.value.data);

const minY = computed(() => {
  const vals = currentPoints.value.map(d => d.value);
  const min = Math.min(...vals);
  return min < 0 ? Math.floor(min * 1.15) : 0;
});

const maxY = computed(() => {
  const vals = currentPoints.value.map(d => d.value);
  const max = Math.max(...vals);
  return Math.ceil(max * 1.15);
});

function getX(index: number) {
  const step = (width - padding.left - padding.right) / (currentPoints.value.length - 1 || 1);
  return padding.left + index * step;
}

function getY(value: number) {
  const range = maxY.value - minY.value || 1;
  const normalized = (value - minY.value) / range;
  return height - padding.bottom - normalized * (height - padding.top - padding.bottom);
}

const linePath = computed(() => {
  if (currentPoints.value.length === 0) return '';
  return currentPoints.value.map((d, i) => {
    const prefix = i === 0 ? 'M' : 'L';
    return `${prefix} ${getX(i)} ${getY(d.value)}`;
  }).join(' ');
});

const areaPath = computed(() => {
  if (currentPoints.value.length === 0) return '';
  const firstX = getX(0);
  const lastX = getX(currentPoints.value.length - 1);
  const zeroY = getY(Math.max(minY.value, 0));
  return `${linePath.value} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;
});

const zeroLineY = computed(() => getY(0));
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
    <!-- Seletor de Abas -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {{ activeConfig.title }}
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Fonte: <span class="font-medium text-slate-700 dark:text-slate-300">{{ activeConfig.source }}</span> • {{ activeConfig.description }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
        <button
          @click="activeTab = 'pib'"
          :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all', activeTab === 'pib' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          PIB
        </button>
        <button
          @click="activeTab = 'inflation'"
          :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all', activeTab === 'inflation' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Inflação (IPCA)
        </button>
        <button
          @click="activeTab = 'unemployment'"
          :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all', activeTab === 'unemployment' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Desemprego
        </button>
        <button
          @click="activeTab = 'debt'"
          :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all', activeTab === 'debt' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Dívida Pública
        </button>
        <button
          @click="activeTab = 'fiscal'"
          :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all', activeTab === 'fiscal' ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Resultado Fiscal
        </button>
      </div>
    </div>

    <!-- Gráfico SVG Responsivo -->
    <div class="relative w-full overflow-x-auto">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full h-auto min-w-[480px] select-none"
      >
        <!-- Linha do Zero (se aplicável) -->
        <line
          v-if="minY < 0"
          :x1="padding.left"
          :y1="zeroLineY"
          :x2="width - padding.right"
          :y2="zeroLineY"
          stroke="currentColor"
          class="text-slate-300 dark:text-slate-700"
          stroke-dasharray="3 3"
          stroke-width="1"
        />

        <!-- Linhas horizontais de grade -->
        <g class="text-slate-200 dark:text-slate-800">
          <line
            v-for="tick in 4"
            :key="'grid-' + tick"
            :x1="padding.left"
            :y1="padding.top + (tick - 1) * ((height - padding.top - padding.bottom) / 3)"
            :x2="width - padding.right"
            :y2="padding.top + (tick - 1) * ((height - padding.top - padding.bottom) / 3)"
            stroke="currentColor"
            stroke-width="0.75"
          />
        </g>

        <!-- Área sombreada -->
        <path
          :d="areaPath"
          :fill="activeConfig.fillColor"
          class="transition-all duration-700 ease-out"
        />

        <!-- Linha da curva -->
        <path
          :d="linePath"
          fill="none"
          :stroke="activeConfig.color"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-all duration-700 ease-out"
        />

        <!-- Pontos com valores -->
        <g v-for="(p, idx) in currentPoints" :key="'p-' + p.year">
          <!-- Linha vertical pontilhada de referência -->
          <line
            :x1="getX(idx)"
            :y1="getY(p.value)"
            :x2="getX(idx)"
            :y2="height - padding.bottom"
            stroke="currentColor"
            class="text-slate-200 dark:text-slate-800"
            stroke-dasharray="2 2"
          />

          <!-- Ponto -->
          <circle
            :cx="getX(idx)"
            :cy="getY(p.value)"
            r="6"
            :fill="activeConfig.color"
            class="stroke-white dark:stroke-slate-900 cursor-pointer transition-transform duration-200 hover:scale-125"
            stroke-width="2"
            @mouseenter="hoveredPoint = { point: p, x: getX(idx), y: getY(p.value) }"
            @mouseleave="hoveredPoint = null"
          />

          <!-- Rótulo do Ano no eixo X -->
          <text
            :x="getX(idx)"
            :y="height - 12"
            text-anchor="middle"
            class="text-xs font-semibold fill-slate-500 dark:fill-slate-400"
          >
            {{ p.year }}
          </text>

          <!-- Valor acima do ponto -->
          <text
            :x="getX(idx)"
            :y="getY(p.value) - 10"
            text-anchor="middle"
            class="text-[11px] font-bold fill-slate-800 dark:fill-slate-200"
          >
            {{ p.value > 0 ? '+' : '' }}{{ p.value }}{{ activeConfig.unit }}
          </text>
        </g>
      </svg>

      <!-- Tooltip Interativo -->
      <div
        v-if="hoveredPoint"
        class="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-700 z-10 whitespace-nowrap"
        :style="{ left: `${(hoveredPoint.x / width) * 100}%`, top: `${(hoveredPoint.y / height) * 100 - 15}%` }"
      >
        <span class="font-bold text-slate-200">{{ hoveredPoint.point.year }}:</span>
        <span class="ml-1 text-emerald-400 font-semibold">{{ hoveredPoint.point.value }}{{ activeConfig.unit }}</span>
        <span v-if="hoveredPoint.point.label" class="block text-[10px] text-slate-300">{{ hoveredPoint.point.label }}</span>
      </div>
    </div>
  </div>
</template>
