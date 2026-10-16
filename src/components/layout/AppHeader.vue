<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCandidateStore, ScoredCandidate } from '../../stores/candidateStore';
import CandidateAvatar from '../shared/CandidateAvatar.vue';
import ScoreGauge from '../shared/ScoreGauge.vue';
import { 
  Menu, 
  Search, 
  X, 
  Sun, 
  Moon, 
  Layers, 
  ShieldCheck, 
  Sliders,
  Sparkles,
  ArrowRight,
  Vote,
  CheckCircle2,
  ChevronRight
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'toggle-mobile-menu'): void;
  (e: 'open-weights'): void;
  (e: 'open-trust'): void;
}>();

const router = useRouter();
const route = useRoute();
const store = useCandidateStore();

const isDark = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchDropdownOpen = ref(false);

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }

  // Atalho de teclado para busca (Ctrl+K ou '/')
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function handleKeydown(e: KeyboardEvent) {
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
    e.preventDefault();
    searchInputRef.value?.focus();
  } else if (e.key === 'Escape') {
    searchDropdownOpen.value = false;
    searchInputRef.value?.blur();
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
}

// Busca em tempo real com dropdown
const searchResults = computed(() => {
  const query = store.searchQuery.trim().toLowerCase();
  if (!query) return [];
  return store.scoredCandidates.filter(c => 
    c.name.toLowerCase().includes(query) ||
    c.popularName.toLowerCase().includes(query) ||
    c.party.toLowerCase().includes(query) ||
    (c.cityOrigin && c.cityOrigin.toLowerCase().includes(query))
  ).slice(0, 6);
});

function selectCandidate(c: ScoredCandidate) {
  searchDropdownOpen.value = false;
  store.searchQuery = '';
  router.push(`/candidato/${c.id}`);
}

function handleSearchSubmit() {
  if (store.searchQuery.trim()) {
    searchDropdownOpen.value = false;
    router.push({ path: '/candidatos' });
  }
}

// Rótulo da Página Atual para Breadcrumb
const pageTitle = computed(() => {
  switch (route.path) {
    case '/': return 'Painel Geral';
    case '/segundo-turno': return '2º Turno Presidencial 2026';
    case '/eleitos': return 'Candidatos Eleitos 2026';
    case '/pesquisas': return 'Pesquisas Eleitorais TSE';
    case '/presidente': return 'Candidatos à Presidência';
    case '/governador-sp': return 'Governador de São Paulo';
    case '/senador': return 'Senadores por São Paulo';
    case '/deputados-bauru': return 'Deputados Federais (Bauru)';
    case '/mandato-atual': return 'Auditoria do Mandato Atual';
    case '/comparador': return 'Comparador de Candidatos';
    case '/candidatos': return 'Todos os Candidatos';
    default: 
      if (route.path.startsWith('/candidato/')) return 'Perfil do Candidato';
      return 'Eleições 2026';
  }
});
</script>

<template>
  <header class="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shrink-0">
    <div class="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
      <!-- Lado Esquerdo: Botão Mobile + Breadcrumb -->
      <div class="flex items-center gap-3 min-w-0">
        <!-- Gatilho do Drawer Mobile -->
        <button
          @click="emit('toggle-mobile-menu')"
          class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Breadcrumb / Título do Contexto Atual -->
        <div class="flex items-center gap-2 min-w-0">
          <button 
            @click="router.push('/')"
            class="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:inline-flex items-center gap-1 transition-colors"
          >
            <span>Voto Consciente</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
          <h1 class="text-sm font-extrabold text-slate-900 dark:text-white truncate">
            {{ pageTitle }}
          </h1>
          <span 
            class="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            OFICIAL TSE
          </span>
        </div>
      </div>

      <!-- Centro: Barra de Busca Global Inteligente (Notion / Jira style) -->
      <div class="relative flex-1 max-w-md hidden md:block">
        <form @submit.prevent="handleSearchSubmit" class="relative">
          <div class="relative flex items-center">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref="searchInputRef"
              v-model="store.searchQuery"
              @focus="searchDropdownOpen = true"
              type="text"
              placeholder="Buscar candidato, partido, cargo... (Ctrl+K)"
              class="w-full pl-9 pr-16 py-1.5 text-xs bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
            <div class="absolute right-2 flex items-center gap-1">
              <button
                v-if="store.searchQuery"
                @click="store.searchQuery = ''; searchDropdownOpen = false"
                type="button"
                class="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X class="w-3 h-3" />
              </button>
              <kbd class="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                /
              </kbd>
            </div>
          </div>
        </form>

        <!-- Dropdown de Resultados Instantâneos -->
        <div
          v-if="searchDropdownOpen && store.searchQuery.trim()"
          class="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800"
        >
          <div class="p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
            Candidatos Encontrados ({{ searchResults.length }})
          </div>

          <div v-if="searchResults.length === 0" class="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Nenhum candidato encontrado para "{{ store.searchQuery }}".
          </div>

          <div 
            v-for="c in searchResults" 
            :key="c.id"
            @click="selectCandidate(c)"
            class="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-xl overflow-hidden shrink-0">
                <CandidateAvatar
                  :name="c.popularName || c.name"
                  :photoUrl="c.photoUrl"
                  :party="c.party"
                  :ballotNumber="c.ballotNumber"
                  size="sm"
                />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {{ c.popularName }}
                </div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {{ c.party }} • {{ c.role === 'presidente' ? 'Presidência' : c.role === 'governador_sp' ? 'Gov. SP' : c.role === 'senador' ? 'Senado SP' : 'Deputado Bauru' }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {{ c.breakdown.finalScore.toFixed(0) }} pts
              </span>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <button
            @click="handleSearchSubmit"
            class="w-full p-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-colors"
          >
            Ver todos os resultados na listagem &rarr;
          </button>
        </div>
      </div>

      <!-- Lado Direito: Seletor de Estado + Comparador + Fontes + Pesos + Dark Mode -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Seletor de UF -->
        <select
          :value="store.selectedState"
          @change="(e: any) => store.setSelectedState(e.target.value)"
          class="text-xs font-bold py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          title="Selecionar Estado (UF)"
        >
          <option
            v-for="s in store.supportedStates"
            :key="s.uf"
            :value="s.uf"
          >
            {{ s.uf }}
          </option>
        </select>

        <!-- Comparador de Candidatos -->
        <button
          @click="router.push('/comparador')"
          class="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="Comparador Lado a Lado"
        >
          <Layers class="w-4 h-4 text-emerald-500" />
          <span class="hidden md:inline">Comparar</span>
          <span 
            v-if="store.selectedForComparison.length > 0"
            class="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-extrabold text-[9px]"
          >
            {{ store.selectedForComparison.length }}
          </span>
        </button>

        <!-- Botão Fontes Confiáveis (Desktop) -->
        <button
          @click="emit('open-trust')"
          class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
          title="Verificação de Fontes Oficiais & TSE"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span class="hidden xl:inline">Fontes Oficiais</span>
        </button>

        <!-- Botão Pesos (Desktop) -->
        <button
          @click="emit('open-weights')"
          class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Personalizar Pesos do Score"
        >
          <Sliders class="w-3.5 h-3.5 text-emerald-500" />
          <span class="hidden xl:inline">Pesos</span>
        </button>

        <!-- Modo Escuro -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          :title="isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  </header>
</template>
