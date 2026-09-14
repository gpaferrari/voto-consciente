<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useCandidateStore } from '../../stores/candidateStore';
import { Sliders, RotateCcw, Check, X, Info } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useCandidateStore();

const localWeights = ref({ ...store.weights });

watch(() => props.isOpen, (open) => {
  if (open) {
    localWeights.value = { ...store.weights };
  }
});

const totalWeight = computed(() => {
  return localWeights.value.education +
    localWeights.value.experience +
    localWeights.value.debates +
    localWeights.value.integrity +
    localWeights.value.governmentPlan;
});

function applyWeights() {
  store.updateWeights(localWeights.value);
  emit('close');
}

function resetToDefault() {
  store.resetWeights();
  localWeights.value = { ...store.weights };
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Sliders class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Personalizar Pesos do Score</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Ajuste os critérios de acordo com o que você mais valoriza no voto</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Corpo com Sliders -->
      <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        <div class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 flex gap-2.5 items-start text-xs text-amber-800 dark:text-amber-300">
          <Info class="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            O total atual dos pesos é <strong>{{ totalWeight }}%</strong>. A plataforma normaliza a média ponderada automaticamente, mas o ideal é manter a soma em 100%.
          </p>
        </div>

        <!-- 1. Escolaridade -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-800 dark:text-slate-200">1. Escolaridade e Formação Acadêmica</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{{ localWeights.education }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            v-model.number="localWeights.education"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Grau de instrução formal e cursos de especialização em gestão pública.</p>
        </div>

        <!-- 2. Experiência -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-800 dark:text-slate-200">2. Experiência Política & Gestão Prévia</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{{ localWeights.experience }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            v-model.number="localWeights.experience"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Tempo de mandato, cargos executivos, assiduidade e produtividade em leis.</p>
        </div>

        <!-- 3. Sabatinas -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-800 dark:text-slate-200">3. Sabatinas & Debates Oficiais</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{{ localWeights.debates }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            v-model.number="localWeights.debates"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Desempenho frente a entrevistadores e taxa de precisão factual das falas.</p>
        </div>

        <!-- 4. Integridade -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-800 dark:text-slate-200">4. Integridade, Ficha Limpa & Fatos</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{{ localWeights.integrity }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            v-model.number="localWeights.integrity"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Certidões judiciais negativas, transparência e ausência de condenações colegiadas.</p>
        </div>

        <!-- 5. Plano de Governo -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-semibold">
            <span class="text-slate-800 dark:text-slate-200">5. Plano de Governo & Viabilidade Fiscal</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{{ localWeights.governmentPlan }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            v-model.number="localWeights.governmentPlan"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Clareza das metas, fontes de financiamento e solidez das propostas registradas.</p>
        </div>
      </div>

      <!-- Rodapé com ações -->
      <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
        <button
          @click="resetToDefault"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Restaurar Padrão
        </button>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('close')"
            class="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="applyWeights"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
          >
            <Check class="w-3.5 h-3.5" />
            Aplicar e Recalcular
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
