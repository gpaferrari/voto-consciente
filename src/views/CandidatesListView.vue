<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCandidateStore } from '../stores/candidateStore';
import { RoleType } from '../types/candidate';
import CandidateCard from '../components/candidate/CandidateCard.vue';
import { Search, Layers, X, ArrowRight } from 'lucide-vue-next';

const props = defineProps<{
  initialRole?: RoleType | 'all';
}>();

const route = useRoute();
const router = useRouter();
const store = useCandidateStore();

const activeRole = ref<RoleType | 'all'>(props.initialRole || 'all');
const sortBy = ref<'finalScore' | 'education' | 'experience' | 'integrity'>('finalScore');

watch(() => route.path, () => {
  if (route.path === '/presidente') activeRole.value = 'presidente';
  else if (route.path === '/governador-sp') activeRole.value = 'governador_sp';
  else if (route.path === '/senador') activeRole.value = 'senador';
  else if (route.path === '/deputados-bauru') activeRole.value = 'deputado_federal_bauru';
  else if (route.path === '/candidatos') activeRole.value = 'all';
}, { immediate: true });

const filteredList = computed(() => {
  let list = store.scoredCandidates.filter(c => {
    const matchesRole = activeRole.value === 'all' || c.role === activeRole.value;
    const query = store.searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.popularName.toLowerCase().includes(query) ||
      c.party.toLowerCase().includes(query) ||
      (c.cityOrigin && c.cityOrigin.toLowerCase().includes(query));
    return matchesRole && matchesSearch;
  });

  return list.sort((a, b) => {
    if (sortBy.value === 'education') return b.breakdown.educationScore - a.breakdown.educationScore;
    if (sortBy.value === 'experience') return b.breakdown.experienceScore - a.breakdown.experienceScore;
    if (sortBy.value === 'integrity') return b.breakdown.integrityScore - a.breakdown.integrityScore;
    return b.breakdown.finalScore - a.breakdown.finalScore;
  });
});

const pageTitle = computed(() => {
  switch (activeRole.value) {
    case 'presidente': return 'Candidatos a Presidente da República';
    case 'governador_sp': return 'Candidatos a Governador do Estado de São Paulo';
    case 'senador': return 'Candidatos ao Senado Federal (São Paulo)';
    case 'deputado_federal_bauru': return 'Deputados Federais (Foco: Bauru e Região Centro-Oeste SP)';
    default: return 'Todos os Candidatos em Avaliação';
  }
});

const pageDescription = computed(() => {
  switch (activeRole.value) {
    case 'presidente': return 'Avaliação técnica com planos de governo, indicadores do IBGE e checagens oficiais.';
    case 'governador_sp': return 'Análise de capacidade de gestão executiva para o maior estado da federação.';
    case 'senador': return 'Parlamentares da Câmara Alta com mandato de 8 anos e poderes constitucionais de controle.';
    case 'deputado_federal_bauru': return 'Representantes com domicílio eleitoral, histórico de emendas e liderança na região de Bauru.';
    default: return 'Explore candidatos aos poderes Executivo e Legislativo avaliados pelo Índice de Aptidão Eleitoral.';
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
    <!-- Cabeçalho da Página -->
    <div class="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
        <span>Pesquisa Eleitoral Apartidária</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
        {{ pageTitle }}
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
        {{ pageDescription }}
      </p>
    </div>

    <!-- Barra de Filtros e Busca -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Tabs de Cargo -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        <button
          @click="activeRole = 'all'"
          :class="['px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap', activeRole === 'all' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Todos
        </button>
        <button
          @click="activeRole = 'presidente'"
          :class="['px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap', activeRole === 'presidente' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Presidente
        </button>
        <button
          @click="activeRole = 'governador_sp'"
          :class="['px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap', activeRole === 'governador_sp' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Gov. SP
        </button>
        <button
          @click="activeRole = 'senador'"
          :class="['px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap', activeRole === 'senador' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Senador SP
        </button>
        <button
          @click="activeRole = 'deputado_federal_bauru'"
          :class="['px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap', activeRole === 'deputado_federal_bauru' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900']"
        >
          Deputados (Bauru)
        </button>
      </div>

      <!-- Campo de Busca e Ordenação -->
      <div class="flex items-center gap-3">
        <!-- Input de Busca -->
        <div class="relative w-full md:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            v-model="store.searchQuery"
            placeholder="Buscar por nome, partido ou cidade..."
            class="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        <!-- Select de Ordenação -->
        <div class="shrink-0">
          <select
            v-model="sortBy"
            class="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="finalScore">Score Geral (Maior)</option>
            <option value="education">Maior Escolaridade</option>
            <option value="experience">Mais Experiência</option>
            <option value="integrity">Maior Integridade</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Grid de Candidatos -->
    <div v-if="filteredList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CandidateCard
        v-for="candidate in filteredList"
        :key="candidate.id"
        :candidate="candidate"
      />
    </div>

    <!-- Estado Vazio -->
    <div v-else class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
      <p class="text-base font-bold text-slate-800 dark:text-slate-200">
        Nenhum candidato encontrado
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Tente ajustar sua busca ou selecionar outro cargo.
      </p>
      <button
        @click="store.searchQuery = ''; activeRole = 'all'"
        class="px-4 py-2 text-xs font-bold text-emerald-600 hover:underline"
      >
        Limpar Filtros
      </button>
    </div>

    <!-- Barra Flutuante de Comparação -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-16 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-16 opacity-0"
    >
      <div
        v-if="store.selectedForComparison.length > 0"
        class="fixed bottom-6 inset-x-0 z-40 max-w-xl mx-auto px-4"
      >
        <div class="bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Layers class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs font-bold">
                {{ store.selectedForComparison.length }} candidato(s) selecionado(s)
              </p>
              <p class="text-[10px] text-slate-400">Selecione até 3 para comparar lado a lado</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="store.clearComparison"
              class="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Limpar seleção"
            >
              <X class="w-4 h-4" />
            </button>
            <button
              @click="router.push('/comparador')"
              class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Ver Comparação</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
