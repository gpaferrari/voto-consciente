<script setup lang="ts">
import { Vote, ShieldCheck, ExternalLink, Heart } from 'lucide-vue-next';
</script>

<template>
  <footer class="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Coluna 1: Missão & Princípios -->
        <div class="md:col-span-2 space-y-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Vote class="w-4 h-4" />
            </div>
            <span class="text-base font-black tracking-tight text-slate-900 dark:text-white">Voto Consciente</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Plataforma cívica apartidária e independente. Desenvolvida para trazer clareza e transparência às eleições brasileiras, unindo dados oficiais do TSE, indicadores macroeconômicos do IBGE/Banco Central e checagens factuais auditáveis.
          </p>
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl max-w-md">
            <ShieldCheck class="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Sem viés partidário. Apenas fatos comprovados e dados abertos da República.</span>
          </div>
        </div>

        <!-- Coluna 2: Fontes Primárias Oficiais -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Fontes de Dados Oficiais</h4>
          <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <a href="https://dadosabertos.tse.jus.br" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                TSE DivulgaCand & Dados Abertos
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://dadosabertos.camara.leg.br" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                Câmara dos Deputados (API v2)
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://dadosabertos.senado.leg.br" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                Senado Federal Dados Abertos
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://sidra.ibge.gov.br" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                IBGE (SIDRA - PIB & Emprego)
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://api.bcb.gov.br" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                Banco Central do Brasil (SGS)
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Coluna 3: Agências de Fact-Checking (IFCN) -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Checagem de Fatos (IFCN)</h4>
          <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <a href="https://aosfatos.org" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                Aos Fatos
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://lupa.uol.com.br" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                Agência Lupa
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://g1.globo.com/fato-ou-fake" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                G1 Fato ou Fake
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://www.estadao.com.br/estadao-verifica" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                Estadão Verifica
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Rodapé Inferior -->
      <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 Voto Consciente. Construído em prol da democracia e do eleitor informado.</p>
        <p class="flex items-center gap-1">
          Feito com <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para o Brasil e Bauru/SP
        </p>
      </div>
    </div>
  </footer>
</template>
