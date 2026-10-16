<script setup lang="ts">
import { ref, computed } from 'vue';
import electedDataRaw from '../data/elected-2026.json';
import type { ElectedOfficial, RegionType, OfficeType } from '../types/elected';
import CandidateAvatar from '../components/shared/CandidateAvatar.vue';
import { 
  Building2, 
  MapPin, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Vote, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  GraduationCap, 
  Activity, 
  ShieldAlert, 
  Leaf, 
  Coins, 
  Scale, 
  Users,
  Filter
} from 'lucide-vue-next';

interface ElectedDataset {
  updatedAt: string;
  totalStates: number;
  totalOfficials: number;
  states: { uf: string; name: string; region: RegionType }[];
  officials: ElectedOfficial[];
}

const data = electedDataRaw as unknown as ElectedDataset;

// Estados e Filtros
const searchQuery = ref('');
const selectedRegion = ref<RegionType | 'Todas'>('Todas');
const selectedState = ref<string>('todos');
const selectedOffice = ref<OfficeType | 'todos'>('todos');
const expandedOfficialId = ref<string | null>(null);

const regions: (RegionType | 'Todas')[] = ['Todas', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'];

const availableStates = computed(() => {
  if (selectedRegion.value === 'Todas') return data.states;
  return data.states.filter(s => s.region === selectedRegion.value);
});

const filteredOfficials = computed(() => {
  return data.officials.filter(official => {
    // Filtro por Região
    if (selectedRegion.value !== 'Todas' && official.region !== selectedRegion.value) {
      return false;
    }
    // Filtro por Estado
    if (selectedState.value !== 'todos' && official.state !== selectedState.value) {
      return false;
    }
    // Filtro por Cargo
    if (selectedOffice.value !== 'todos' && official.office !== selectedOffice.value) {
      return false;
    }
    // Busca Textual (Nome, Partido, UF ou texto de proposta)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchName = official.popularName.toLowerCase().includes(q) || official.name.toLowerCase().includes(q);
      const matchParty = official.party.toLowerCase().includes(q);
      const matchState = official.stateName.toLowerCase().includes(q) || official.state.toLowerCase().includes(q);
      const matchProposal = official.proposals.some(p => 
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
      const matchSummary = official.keyCommitmentSummary.toLowerCase().includes(q);
      return matchName || matchParty || matchState || matchProposal || matchSummary;
    }
    return true;
  });
});

function toggleExpand(id: string) {
  if (expandedOfficialId.value === id) {
    expandedOfficialId.value = null;
  } else {
    expandedOfficialId.value = id;
  }
}

function selectRegionFilter(reg: RegionType | 'Todas') {
  selectedRegion.value = reg;
  selectedState.value = 'todos';
}

function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'economia': return TrendingUp;
    case 'educacao': return GraduationCap;
    case 'saude': return Activity;
    case 'seguranca': return ShieldAlert;
    case 'meio_ambiente': return Leaf;
    case 'infraestrutura': return Building2;
    case 'reformas': return Scale;
    default: return FileText;
  }
}

function formatVotes(num: number) {
  return new Intl.NumberFormat('pt-BR').format(num);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8 pb-8 min-w-0">
    <!-- Header -->
    <div class="border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="flex items-center gap-2 mb-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Proclamação Oficial TSE &bull; Eleições 2026
        </span>
        <span class="text-xs text-slate-500 font-mono">27 Unidades da Federação</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Candidatos Eleitos em 2026 & Suas Propostas
      </h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
        Consulte os governadores, senadores da República e deputados federais eleitos para o mandato 2027-2030 em todos os estados do Brasil.
        Acompanhe e fiscalize as <strong>propostas e compromissos concretos</strong> firmados por cada mandatário com a população.
      </p>
    </div>

    <!-- Barra de Filtros Integrados -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
      <!-- Regiões Pills -->
      <div>
        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Filtrar por Região do Brasil:
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="reg in regions"
            :key="reg"
            @click="selectRegionFilter(reg)"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
              selectedRegion === reg
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            ]"
          >
            {{ reg }}
          </button>
        </div>
      </div>

      <!-- Filtros Dropdowns & Busca -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <!-- Busca -->
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome, partido ou proposta..."
            class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Estado Selector -->
        <div>
          <select
            v-model="selectedState"
            class="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Estados (27 UFs)</option>
            <option v-for="st in availableStates" :key="st.uf" :value="st.uf">
              {{ st.name }} ({{ st.uf }})
            </option>
          </select>
        </div>

        <!-- Cargo Selector -->
        <div>
          <select
            v-model="selectedOffice"
            class="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Cargos</option>
            <option value="governador">Governadores Eleitos</option>
            <option value="senador">Senadores Eleitos (2 por Estado)</option>
            <option value="deputado_federal">Deputados Federais</option>
          </select>
        </div>

        <!-- Total Indicator -->
        <div class="flex items-center justify-end px-3 text-xs text-slate-500 font-mono">
          Mostrando {{ filteredOfficials.length }} eleitos
        </div>
      </div>
    </div>

    <!-- Lista de Eleitos com Propostas Expansíveis -->
    <div v-if="filteredOfficials.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="official in filteredOfficials"
        :key="official.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between"
      >
        <div>
          <!-- Topo do Card -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <CandidateAvatar
                  :name="official.popularName || official.name"
                  :photoUrl="official.photoUrl"
                  :party="official.party"
                  :ballotNumber="official.ballotNumber"
                  size="sm"
                />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    {{ official.popularName }}
                  </h3>
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {{ official.party }}
                  </span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ official.officeLabel }}</span>
                  <span>&bull;</span>
                  <span class="flex items-center gap-0.5">
                    <MapPin class="w-3 h-3 text-slate-400" />
                    {{ official.stateName }} ({{ official.state }})
                  </span>
                </div>
              </div>
            </div>

            <!-- Badge de Votos -->
            <div class="text-right shrink-0">
              <span class="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg">
                {{ official.votePercentage }}%
              </span>
              <p class="text-[10px] text-slate-400 font-mono mt-0.5">
                {{ formatVotes(official.votes) }} votos
              </p>
            </div>
          </div>

          <!-- Resumo de Compromissos -->
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {{ official.keyCommitmentSummary }}
          </p>

          <!-- Seção de Propostas (Expand/Collapse) -->
          <div class="border-t border-slate-100 dark:border-slate-800/80 pt-3">
            <button
              @click="toggleExpand(official.id)"
              class="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 transition-colors"
            >
              <span class="flex items-center gap-1.5">
                <FileText class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Principais Propostas Registradas ({{ official.proposals.length }})</span>
              </span>
              <component :is="expandedOfficialId === official.id ? ChevronUp : ChevronDown" class="w-4 h-4 text-slate-400" />
            </button>

            <!-- Lista de Propostas Detalhadas -->
            <div
              v-if="expandedOfficialId === official.id"
              class="mt-3 space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn"
            >
              <div
                v-for="(prop, pIdx) in official.proposals"
                :key="pIdx"
                class="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
              >
                <div class="flex items-center gap-1.5">
                  <component :is="getCategoryIcon(prop.category)" class="w-3.5 h-3.5 text-emerald-500" />
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {{ prop.categoryLabel }}
                  </span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white leading-snug">
                  {{ prop.title }}
                </h4>
                <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ prop.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rodapé do Card com Ficha Limpa -->
        <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span class="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
            Ficha Limpa / Registro Regular
          </span>
          <span class="text-slate-400 font-mono text-[10px]">
            Número: {{ official.ballotNumber }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-3">
      <Filter class="w-8 h-8 text-slate-400 mx-auto" />
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">Nenhum candidato encontrado</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Tente ajustar os filtros de região, estado ou o termo digitado na barra de pesquisa.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.15s ease-out;
}
</style>
