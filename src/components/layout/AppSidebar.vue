<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCandidateStore } from '../../stores/candidateStore';
import { 
  Home,
  Vote, 
  CheckCircle2, 
  BarChart3, 
  UserCheck, 
  Building2, 
  Award, 
  Scale, 
  ActivitySquare, 
  Layers, 
  ShieldCheck, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  ExternalLink,
  X
} from 'lucide-vue-next';

const props = defineProps<{
  isMobileOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isMobileOpen', value: boolean): void;
  (e: 'open-weights'): void;
  (e: 'open-trust'): void;
}>();

const route = useRoute();
const router = useRouter();
const store = useCandidateStore();

// Estado do Sidebar recolhido (Notion / Jira style)
const isCollapsed = ref<boolean>(false);

onMounted(() => {
  const savedState = localStorage.getItem('voto_consciente_sidebar_collapsed');
  if (savedState !== null) {
    isCollapsed.value = savedState === 'true';
  } else {
    // Em telas médias, pode iniciar recolhido para priorizar conteúdo
    if (window.innerWidth < 1280 && window.innerWidth >= 768) {
      isCollapsed.value = true;
    }
  }
});

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('voto_consciente_sidebar_collapsed', String(isCollapsed.value));
}

function handleNavigate(path: string) {
  router.push(path);
  emit('update:isMobileOpen', false);
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  badgeClass?: string;
  description: string;
  urgent?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups = computed<NavGroup[]>(() => [
  {
    title: 'Principal',
    items: [
      {
        name: 'Início',
        path: '/',
        icon: Home,
        description: 'Painel geral e destaques das eleições'
      }
    ]
  },
  {
    title: 'Eleições 2026',
    items: [
      {
        name: '2º Turno Presidencial',
        path: '/segundo-turno',
        icon: Flame,
        badge: 'Apurado',
        badgeClass: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
        description: 'Resultado Oficial TSE (25/10): Lula 51,79% vs Flávio 48,21%',
        urgent: true
      },
      {
        name: 'Candidatos Eleitos 2026',
        path: '/eleitos',
        icon: CheckCircle2,
        badge: '27 UFs',
        badgeClass: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
        description: 'Governadores e Senadores eleitos com propostas'
      },
      {
        name: 'Pesquisas Eleitorais TSE',
        path: '/pesquisas',
        icon: BarChart3,
        badge: 'Oficial',
        badgeClass: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
        description: 'Agregador de levantamentos registrados no TSE'
      }
    ]
  },
  {
    title: 'Cargos & Candidatos',
    items: [
      {
        name: 'Presidente da República',
        path: '/presidente',
        icon: Vote,
        description: 'Candidatos com registro homologado pelo TSE'
      },
      {
        name: 'Governador de SP',
        path: '/governador-sp',
        icon: Building2,
        badge: 'SP',
        badgeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
        description: 'Executivo estadual e resultado do 1º turno'
      },
      {
        name: 'Senadores por SP',
        path: '/senador',
        icon: Award,
        badge: 'SP',
        badgeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
        description: 'Senado Federal e mandatos de 8 anos'
      },
      {
        name: 'Deputados Federais (Bauru)',
        path: '/deputados-bauru',
        icon: Scale,
        badge: 'Local',
        badgeClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30',
        description: 'Representação regional do Centro-Oeste paulista'
      }
    ]
  },
  {
    title: 'Auditoria & Metodologia',
    items: [
      {
        name: 'Auditoria Mandato Atual',
        path: '/mandato-atual',
        icon: ActivitySquare,
        description: 'Prestação de contas 2023-2026: PIB, IPCA e metas'
      },
      {
        name: 'Comparador de Candidatos',
        path: '/comparador',
        icon: Layers,
        badge: store.selectedForComparison.length > 0 ? String(store.selectedForComparison.length) : undefined,
        badgeClass: 'bg-emerald-600 text-white font-extrabold',
        description: 'Comparação técnica lado a lado de propostas e scores'
      }
    ]
  }
]);

const hoveredTooltip = ref<{ name: string; description: string; top: number } | null>(null);

function handleMouseEnter(item: NavItem, event: MouseEvent) {
  if (!isCollapsed.value) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  hoveredTooltip.value = {
    name: item.name,
    description: item.description,
    top: rect.top
  };
}

function handleMouseLeave() {
  hoveredTooltip.value = null;
}
</script>

<template>
  <div>
    <!-- Backdrop para Mobile Drawer -->
    <div 
      v-if="isMobileOpen" 
      @click="emit('update:isMobileOpen', false)"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-50 lg:static lg:z-20 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 ease-in-out select-none',
        // Largura no Desktop
        isCollapsed ? 'lg:w-16' : 'lg:w-64',
        // Comportamento Mobile (Off-canvas)
        isMobileOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Topo da Sidebar (Brand & Toggle) -->
      <div class="h-16 flex items-center justify-between px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <!-- Logo / Brand quando expandido -->
        <div 
          v-if="!isCollapsed || isMobileOpen"
          @click="handleNavigate('/')"
          class="flex items-center gap-2.5 cursor-pointer group min-w-0"
        >
          <div class="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-600 to-sky-600 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Vote class="w-4 h-4" />
          </div>
          <div class="truncate">
            <span class="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white block truncate leading-tight">
              Voto Consciente
            </span>
            <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
              Eleições Oficiais 2026
            </span>
          </div>
        </div>

        <!-- Logo compacta quando recolhido no Desktop -->
        <div 
          v-else 
          @click="handleNavigate('/')"
          class="w-full flex justify-center cursor-pointer group"
          title="Voto Consciente - Ir para o Início"
        >
          <div class="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-600 to-sky-600 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
            <Vote class="w-5 h-5" />
          </div>
        </div>

        <!-- Botão Fechar no Mobile -->
        <button
          v-if="isMobileOpen"
          @click="emit('update:isMobileOpen', false)"
          class="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Fechar menu lateral"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Botão Toggle Collapse no Desktop (Notion / Jira style) -->
        <button
          v-if="!isMobileOpen"
          @click="toggleCollapse"
          class="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="isCollapsed ? 'Expandir barra lateral (Ctrl+B)' : 'Recolher barra lateral (Ctrl+B)'"
        >
          <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Área de Navegação com Scroll Suave -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
        <div 
          v-for="(group, gIdx) in navGroups" 
          :key="gIdx" 
          class="space-y-1"
        >
          <!-- Título do Grupo (apenas quando expandido) -->
          <div 
            v-if="!isCollapsed || isMobileOpen" 
            class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {{ group.title }}
          </div>
          <div 
            v-else 
            class="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2 mx-2"
          ></div>

          <!-- Itens do Grupo -->
          <div 
            v-for="item in group.items" 
            :key="item.path"
            class="relative"
            @mouseenter="handleMouseEnter(item, $event)"
            @mouseleave="handleMouseLeave"
          >
            <RouterLink
              :to="item.path"
              @click="emit('update:isMobileOpen', false)"
              :class="[
                'w-full flex items-center gap-3 rounded-xl transition-all duration-150 text-left cursor-pointer group',
                isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'px-3 py-2 text-xs font-semibold',
                route.path === item.path
                  ? item.urgent 
                    ? 'bg-rose-500/15 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30'
                    : 'bg-emerald-500/15 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
              ]"
            >
              <!-- Ícone -->
              <div class="relative shrink-0 flex items-center justify-center">
                <component 
                  :is="item.icon" 
                  :class="[
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    route.path === item.path
                      ? item.urgent ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  ]" 
                />
                <!-- Pulse para itens urgentes -->
                <span 
                  v-if="item.urgent && isCollapsed && !isMobileOpen"
                  class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                ></span>
              </div>

              <!-- Rótulo & Badge quando expandido -->
              <div 
                v-if="!isCollapsed || isMobileOpen" 
                class="flex-1 flex items-center justify-between min-w-0"
              >
                <span class="truncate">{{ item.name }}</span>
                <span 
                  v-if="item.badge" 
                  :class="[
                    'text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5',
                    item.badgeClass || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  ]"
                >
                  {{ item.badge }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Rodapé da Sidebar (Ferramentas & Auditoria) -->
      <div class="p-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
        <!-- Fontes Confiáveis -->
        <button
          @click="emit('open-trust'); emit('update:isMobileOpen', false)"
          :class="[
            'w-full flex items-center gap-3 rounded-xl transition-colors cursor-pointer text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
            isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'px-3 py-2 text-xs font-semibold'
          ]"
          :title="isCollapsed ? 'Auditar Fontes Oficiais & TSE' : undefined"
        >
          <ShieldCheck class="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span v-if="!isCollapsed || isMobileOpen" class="truncate">Fontes Oficiais</span>
        </button>

        <!-- Personalizar Pesos -->
        <button
          @click="emit('open-weights'); emit('update:isMobileOpen', false)"
          :class="[
            'w-full flex items-center gap-3 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800',
            isCollapsed && !isMobileOpen ? 'justify-center p-2.5' : 'px-3 py-2 text-xs font-semibold'
          ]"
          :title="isCollapsed ? 'Personalizar Pesos do Score' : undefined"
        >
          <Sliders class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed || isMobileOpen" class="truncate">Pesos do Score</span>
        </button>

        <!-- Indicador de Status Compacto -->
        <div 
          v-if="!isCollapsed || isMobileOpen" 
          class="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5"
        >
          <div class="flex items-center justify-between font-bold">
            <span class="text-slate-700 dark:text-slate-300">Base Homologada</span>
            <span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              TSE 2026
            </span>
          </div>
          <p class="text-[9px] text-slate-400 leading-tight">Atualizado com o resultado oficial de 1º e 2º turnos.</p>
        </div>
      </div>
    </aside>

    <!-- Floating Tooltip para modo recolhido (Notion / Jira Hover Peek) -->
    <Teleport to="body">
      <div
        v-if="hoveredTooltip && isCollapsed"
        class="fixed left-18 z-50 pointer-events-none transition-all duration-150"
        :style="{ top: `${hoveredTooltip.top + 2}px` }"
      >
        <div class="bg-slate-900 text-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-xl text-xs max-w-xs border border-slate-700 animate-in fade-in zoom-in-95">
          <div class="font-bold text-slate-100">{{ hoveredTooltip.name }}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">{{ hoveredTooltip.description }}</div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
