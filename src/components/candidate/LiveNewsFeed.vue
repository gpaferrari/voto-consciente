<script setup lang="ts">
import { ref, computed } from 'vue';
import { Newspaper, ExternalLink, Search, Filter, ShieldCheck } from 'lucide-vue-next';
import liveNewsData from '../../data/live-news.json';

interface NewsItem {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'proposta' | 'gestao' | 'juridico' | 'declaracao' | 'pesquisa';
  summary?: string;
}

const props = defineProps<{
  candidateId?: string; // If supplied, filters by candidate; if omitted, shows all
  limit?: number;
  compact?: boolean;
}>();

const allNews = ref<NewsItem[]>(liveNewsData as unknown as NewsItem[]);
const searchQuery = ref('');
const selectedCategory = ref<string>('todos');

const filteredNews = computed(() => {
  let list = props.candidateId 
    ? allNews.value.filter(n => n.candidateId === props.candidateId)
    : allNews.value;

  if (selectedCategory.value !== 'todos') {
    list = list.filter(n => n.category === selectedCategory.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.source.toLowerCase().includes(q) ||
      n.candidateName.toLowerCase().includes(q)
    );
  }

  if (props.limit && props.limit > 0) {
    return list.slice(0, props.limit);
  }

  return list;
});

const getCategoryBadge = (cat: NewsItem['category']) => {
  switch (cat) {
    case 'juridico':
      return { label: 'Jurídico / STF / TSE', class: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
    case 'gestao':
      return { label: 'Gestão Pública', class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
    case 'proposta':
      return { label: 'Proposta / Plano', class: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
    case 'pesquisa':
      return { label: 'Pesquisa / Índices', class: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
    default:
      return { label: 'Declaração / Notícia', class: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
  }
};

const formatDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
</script>

<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors shadow-xs">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
          <Newspaper class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Notícias & Cobertura em Tempo Real</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              Ao Vivo
            </span>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Veículos de imprensa consolidados com links diretos para apuração na fonte
          </p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div v-if="!compact" class="flex flex-wrap items-center gap-2">
        <!-- Search Input -->
        <div class="relative">
          <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar notícia..."
            class="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-36 sm:w-44"
          />
        </div>

        <!-- Category Dropdown -->
        <select
          v-model="selectedCategory"
          class="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden"
        >
          <option value="todos">Todas Categorias</option>
          <option value="proposta">Proposta</option>
          <option value="gestao">Gestão</option>
          <option value="juridico">Jurídico / STF / TSE</option>
          <option value="pesquisa">Pesquisas</option>
          <option value="declaracao">Geral</option>
        </select>
      </div>
    </div>

    <!-- Feed List -->
    <div v-if="filteredNews.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
      <article
        v-for="item in filteredNews"
        :key="item.id"
        class="py-3.5 first:pt-2 group flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 -mx-3 px-3 rounded-lg transition-colors"
      >
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Candidate Badge if viewing global feed -->
            <span
              v-if="!props.candidateId"
              class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {{ item.candidateName }}
            </span>

            <!-- Category Badge -->
            <span
              :class="[
                'text-[10px] font-semibold px-2 py-0.5 rounded-md border',
                getCategoryBadge(item.category).class
              ]"
            >
              {{ getCategoryBadge(item.category).label }}
            </span>

            <!-- Source Name -->
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {{ item.source }}
            </span>

            <!-- Date -->
            <span class="text-[11px] text-slate-400 font-mono">
              &bull; {{ formatDate(item.publishedAt) }}
            </span>
          </div>

          <!-- Headline -->
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ item.title }}
          </h4>
        </div>

        <!-- Direct Link Button -->
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60 transition-colors self-start sm:self-center"
          title="Abrir reportagem original no veículo"
        >
          <span>Ler Matéria</span>
          <ExternalLink class="w-3 h-3" />
        </a>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="py-8 text-center text-slate-400 text-xs">
      Nenhuma notícia encontrada para os critérios selecionados. Execute <code>npm run scrape:news</code> para atualizar as fontes.
    </div>

    <!-- Footer Note -->
    <div class="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
      <span class="inline-flex items-center gap-1">
        <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
        Fontes apuradas e indexadas sem alteração de conteúdo ou emissão de juízo de valor.
      </span>
      <span class="text-[10px] font-mono">
        Total: {{ filteredNews.length }}
      </span>
    </div>
  </div>
</template>
