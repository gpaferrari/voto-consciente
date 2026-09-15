<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCandidateStore } from '../../stores/candidateStore';
import WeightCustomizerModal from '../shared/WeightCustomizerModal.vue';
import { 
  Vote, 
  Sliders, 
  Layers, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ActivitySquare,
  BarChart3
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const store = useCandidateStore();

const isDark = ref(false);
const isMobileMenuOpen = ref(false);
const isWeightsModalOpen = ref(false);

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

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

function navigate(path: string) {
  router.push(path);
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
      <!-- Logo da Plataforma -->
      <div 
        @click="navigate('/')" 
        class="flex items-center gap-3 cursor-pointer group shrink-0"
      >
        <div class="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Vote class="w-5 h-5" />
        </div>
        <div>
          <span class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Voto Consciente
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">OFICIAL</span>
          </span>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fatos Comprovados & Scores</p>
        </div>
      </div>

      <!-- Links de Navegação Desktop -->
      <nav class="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
        <button
          @click="navigate('/')"
          :class="[
            'px-3 py-2 rounded-xl transition-all',
            route.path === '/' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          Início
        </button>

        <button
          @click="navigate('/presidente')"
          :class="[
            'px-3 py-2 rounded-xl transition-all',
            route.path === '/presidente' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          Presidente
        </button>

        <button
          @click="navigate('/governador-sp')"
          :class="[
            'px-3 py-2 rounded-xl transition-all',
            route.path === '/governador-sp' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          Governador SP
        </button>

        <button
          @click="navigate('/senador')"
          :class="[
            'px-3 py-2 rounded-xl transition-all',
            route.path === '/senador' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          Senador
        </button>

        <button
          @click="navigate('/deputados-bauru')"
          :class="[
            'px-3 py-2 rounded-xl transition-all flex items-center gap-1.5',
            route.path === '/deputados-bauru' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <span>Deputados Bauru</span>
          <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">SP</span>
        </button>

        <button
          @click="navigate('/pesquisas')"
          :class="[
            'px-3 py-2 rounded-xl transition-all flex items-center gap-1.5',
            route.path === '/pesquisas' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <BarChart3 class="w-3.5 h-3.5 text-blue-500" />
          <span>Pesquisas TSE</span>
        </button>

        <button
          @click="navigate('/mandato-atual')"
          :class="[
            'px-3 py-2 rounded-xl transition-all flex items-center gap-1.5',
            route.path === '/mandato-atual' 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <ActivitySquare class="w-3.5 h-3.5 text-sky-500" />
          <span>Mandato Atual</span>
        </button>
      </nav>

      <!-- Ações Direita: Seletor de Estado + Comparador + Pesos + Dark Mode -->
      <div class="flex items-center gap-2">
        <!-- Seletor de Estado (UF) -->
        <div class="relative hidden sm:flex items-center">
          <select
            :value="store.selectedState"
            @change="(e: any) => store.setSelectedState(e.target.value)"
            class="text-xs font-bold py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            title="Selecionar Estado (UF) para cargos estaduais"
          >
            <option
              v-for="s in store.supportedStates"
              :key="s.uf"
              :value="s.uf"
            >
              {{ s.uf }} - {{ s.name }}{{ s.available ? '' : ' (Em breve)' }}
            </option>
          </select>
        </div>

        <!-- Botão Comparador -->
        <button
          @click="navigate('/comparador')"
          class="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Comparador Lado a Lado"
        >
          <Layers class="w-3.5 h-3.5 text-emerald-500" />
          <span class="hidden md:inline">Comparar</span>
          <span 
            v-if="store.selectedForComparison.length > 0"
            class="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-extrabold text-[9px]"
          >
            {{ store.selectedForComparison.length }}
          </span>
        </button>

        <!-- Botão Ajustar Pesos -->
        <button
          @click="isWeightsModalOpen = true"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Sliders class="w-3.5 h-3.5 text-emerald-500" />
          <span>Pesos</span>
        </button>

        <!-- Modo Escuro -->
        <button
          @click="toggleDarkMode"
          class="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-600" />
        </button>

        <!-- Botão Menu Mobile -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Menu Dropdown Mobile -->
    <div v-if="isMobileMenuOpen" class="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2">
      <button
        @click="navigate('/')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Início
      </button>
      <button
        @click="navigate('/presidente')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Presidente da República
      </button>
      <button
        @click="navigate('/governador-sp')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Governador do Estado de SP
      </button>
      <button
        @click="navigate('/senador')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Senador por SP
      </button>
      <button
        @click="navigate('/deputados-bauru')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Deputados Federais (Foco Bauru)
      </button>
      <button
        @click="navigate('/pesquisas')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
      >
        <BarChart3 class="w-4 h-4 text-blue-500" />
        <span>Pesquisas TSE Registradas</span>
      </button>
      <button
        @click="navigate('/mandato-atual')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Auditoria do Mandato Atual
      </button>
      <button
        @click="navigate('/comparador')"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Comparador Lado a Lado ({{ store.selectedForComparison.length }})
      </button>
      <button
        @click="isWeightsModalOpen = true; isMobileMenuOpen = false"
        class="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
      >
        <Sliders class="w-4 h-4 text-emerald-500" />
        <span>Personalizar Pesos do Score</span>
      </button>
    </div>

    <!-- Modal de Pesos -->
    <WeightCustomizerModal
      :isOpen="isWeightsModalOpen"
      @close="isWeightsModalOpen = false"
    />
  </header>
</template>
