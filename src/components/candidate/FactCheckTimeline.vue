<script setup lang="ts">
import { ref, computed } from 'vue';
import { FactCheckItem, FactCategory } from '../../types/candidate';
import FactCheckBadge from '../shared/FactCheckBadge.vue';
import { ExternalLink, ShieldCheck, Scale, Info } from 'lucide-vue-next';

const props = defineProps<{
  items: FactCheckItem[];
  cleanCertificates: { court: string; status: 'nada_consta' | 'regular' | 'com_apontamentos' }[];
}>();

const selectedCategory = ref<FactCategory | 'all'>('all');

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') return props.items;
  return props.items.filter(i => i.category === selectedCategory.value);
});
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-6 space-y-6">
    <!-- Header com compromisso ético -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Scale class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Histórico Judicial, Notícias & Fatos Verificados
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Apenas decisões de tribunais e checagens de agências oficiais (IFCN). Sem boatos ou suposições.
            </p>
          </div>
        </div>
      </div>

      <!-- Certidões Negativas -->
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-for="(cert, cIdx) in cleanCertificates"
          :key="cIdx"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
          <span>{{ cert.court }}:</span>
          <strong class="text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">{{ cert.status.replace('_', ' ') }}</strong>
        </span>
      </div>
    </div>

    <!-- Filtros por Categoria Ética -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        @click="selectedCategory = 'all'"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
          selectedCategory === 'all'
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
        ]"
      >
        Todos ({{ items.length }})
      </button>
      <button
        @click="selectedCategory = 'comprovado_positivo'"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
          selectedCategory === 'comprovado_positivo'
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
        ]"
      >
        Fatos Oficiais Comprovados
      </button>
      <button
        @click="selectedCategory = 'boato_desmentido'"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
          selectedCategory === 'boato_desmentido'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60'
        ]"
      >
        Boatos Desmentidos
      </button>
      <button
        @click="selectedCategory = 'arquivado'"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border',
          selectedCategory === 'arquivado'
            ? 'bg-slate-700 text-white border-slate-700'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        ]"
      >
        Arquivados / Anulações
      </button>
    </div>

    <!-- Lista de Itens Auditados -->
    <div class="space-y-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <FactCheckBadge :category="item.category" />
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
            {{ item.date }} • {{ item.vehicleOrOrgan }}
          </span>
        </div>

        <h4 class="text-sm md:text-base font-bold text-slate-900 dark:text-white">
          {{ item.title }}
        </h4>

        <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ item.description }}
        </p>

        <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-700/60">
          <span v-if="item.judicialLevel" class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Instância: <strong class="text-slate-700 dark:text-slate-300">{{ item.judicialLevel }}</strong>
          </span>
          <span v-else class="text-[11px] text-slate-400">Checagem Jornalística Certificada</span>

          <a
            :href="item.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Ver Documento Oficial / Notícia na Íntegra</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
        Nenhum registro encontrado para esta categoria de checagem.
      </div>
    </div>

    <!-- Nota Ética de Rodapé -->
    <div class="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
      <Info class="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <p>
        <strong>Compromisso Democrático:</strong> Toda informação nesta seção conta com link direto para a fonte primária do Tribunal ou agência certificada pelo International Fact-Checking Network (IFCN). Respeitamos rigorosamente o princípio constitucional da presunção de inocência (Art. 5º, LVII da CF/88).
      </p>
    </div>
  </div>
</template>
