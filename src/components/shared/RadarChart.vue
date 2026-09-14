<script setup lang="ts">
import { computed } from 'vue';
import { ScoreBreakdown } from '../../types/candidate';

interface CandidateRadarData {
  name: string;
  color: string;
  fillColor: string;
  breakdown: ScoreBreakdown;
}

const props = withDefaults(defineProps<{
  primary: CandidateRadarData;
  secondary?: CandidateRadarData | null;
  size?: number;
}>(), {
  secondary: null,
  size: 320
});

const dimensions = [
  { key: 'educationScore', label: 'Escolaridade' },
  { key: 'experienceScore', label: 'Experiência' },
  { key: 'debatesScore', label: 'Sabatinas' },
  { key: 'integrityScore', label: 'Integridade' },
  { key: 'governmentPlanScore', label: 'Plano de Gov.' }
];

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size / 2) - 45); // Margem para os rótulos

const levels = [20, 40, 60, 80, 100];

// Calcula coordenadas polares para cartesianas
function getCoordinates(value: number, index: number, total: number) {
  const angle = (Math.PI * 2 / total) * index - (Math.PI / 2);
  const distance = (value / 100) * radius.value;
  return {
    x: center.value + distance * Math.cos(angle),
    y: center.value + distance * Math.sin(angle)
  };
}

// Coordenadas dos vértices dos anéis de fundo
const levelPolygons = computed(() => {
  return levels.map(level => {
    const points = dimensions.map((_, i) => {
      const coord = getCoordinates(level, i, dimensions.length);
      return `${coord.x},${coord.y}`;
    }).join(' ');
    return { level, points };
  });
});

// Coordenadas das linhas dos eixos
const axisLines = computed(() => {
  return dimensions.map((dim, i) => {
    const end = getCoordinates(100, i, dimensions.length);
    const labelPos = getCoordinates(118, i, dimensions.length);
    return {
      label: dim.label,
      x1: center.value,
      y1: center.value,
      x2: end.x,
      y2: end.y,
      labelX: labelPos.x,
      labelY: labelPos.y
    };
  });
});

// Polígono do candidato principal
const primaryPolygon = computed(() => {
  const points = dimensions.map((dim, i) => {
    const val = (props.primary.breakdown as any)[dim.key] || 0;
    const coord = getCoordinates(val, i, dimensions.length);
    return `${coord.x},${coord.y}`;
  }).join(' ');
  return points;
});

// Pontos marcadores do candidato principal
const primaryDots = computed(() => {
  return dimensions.map((dim, i) => {
    const val = (props.primary.breakdown as any)[dim.key] || 0;
    const coord = getCoordinates(val, i, dimensions.length);
    return { ...coord, value: val, label: dim.label };
  });
});

// Polígono do candidato secundário (se houver)
const secondaryPolygon = computed(() => {
  if (!props.secondary) return '';
  const points = dimensions.map((dim, i) => {
    const val = (props.secondary!.breakdown as any)[dim.key] || 0;
    const coord = getCoordinates(val, i, dimensions.length);
    return `${coord.x},${coord.y}`;
  }).join(' ');
  return points;
});

const secondaryDots = computed(() => {
  if (!props.secondary) return [];
  return dimensions.map((dim, i) => {
    const val = (props.secondary!.breakdown as any)[dim.key] || 0;
    const coord = getCoordinates(val, i, dimensions.length);
    return { ...coord, value: val, label: dim.label };
  });
});
</script>

<template>
  <div class="flex flex-col items-center select-none">
    <div class="relative">
      <svg :width="size" :height="size" class="overflow-visible">
        <!-- Níveis concêntricos -->
        <polygon
          v-for="lvl in levelPolygons"
          :key="lvl.level"
          :points="lvl.points"
          fill="none"
          stroke="currentColor"
          stroke-dasharray="2 2"
          class="text-slate-200 dark:text-slate-800"
          stroke-width="1"
        />

        <!-- Linhas dos eixos -->
        <line
          v-for="axis in axisLines"
          :key="axis.label"
          :x1="axis.x1"
          :y1="axis.y1"
          :x2="axis.x2"
          :y2="axis.y2"
          stroke="currentColor"
          class="text-slate-200 dark:text-slate-800"
          stroke-width="1"
        />

        <!-- Rótulos dos eixos -->
        <text
          v-for="axis in axisLines"
          :key="'label-' + axis.label"
          :x="axis.labelX"
          :y="axis.labelY"
          text-anchor="middle"
          dominant-baseline="central"
          class="text-[11px] font-semibold fill-slate-600 dark:fill-slate-400"
        >
          {{ axis.label }}
        </text>

        <!-- Polígono Candidato Secundário (se houver) -->
        <polygon
          v-if="secondary && secondaryPolygon"
          :points="secondaryPolygon"
          :fill="secondary.fillColor || 'rgba(99, 102, 241, 0.25)'"
          :stroke="secondary.color || '#6366f1'"
          stroke-width="2"
          class="transition-all duration-500"
        />

        <!-- Marcadores Secundário -->
        <circle
          v-for="(dot, idx) in secondaryDots"
          :key="'sec-dot-' + idx"
          :cx="dot.x"
          :cy="dot.y"
          r="4"
          :fill="secondary?.color || '#6366f1'"
          class="stroke-white dark:stroke-slate-900"
          stroke-width="1.5"
        />

        <!-- Polígono Candidato Principal -->
        <polygon
          :points="primaryPolygon"
          :fill="primary.fillColor || 'rgba(16, 185, 129, 0.25)'"
          :stroke="primary.color || '#10b981'"
          stroke-width="2.5"
          class="transition-all duration-500"
        />

        <!-- Marcadores Principal -->
        <g v-for="(dot, idx) in primaryDots" :key="'prim-dot-' + idx">
          <circle
            :cx="dot.x"
            :cy="dot.y"
            r="4.5"
            :fill="primary.color || '#10b981'"
            class="stroke-white dark:stroke-slate-900"
            stroke-width="2"
          />
          <text
            :x="dot.x"
            :y="dot.y - 8"
            text-anchor="middle"
            class="text-[10px] font-bold fill-slate-700 dark:fill-slate-200"
          >
            {{ dot.value }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Legenda se houver 2 candidatos -->
    <div v-if="secondary" class="mt-3 flex items-center gap-5 text-xs font-medium">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
        <span class="text-slate-700 dark:text-slate-300 font-semibold">{{ primary.name }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
        <span class="text-slate-700 dark:text-slate-300 font-semibold">{{ secondary.name }}</span>
      </div>
    </div>
  </div>
</template>
