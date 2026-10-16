<script setup lang="ts">
import { ref } from 'vue';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  X,
  FileCheck2,
  Database,
  Award,
  Globe2
} from 'lucide-vue-next';
import { 
  validateSourceUrl, 
  validateTseRegistration, 
  OFFICIAL_GOV_DOMAINS,
  FACT_CHECKING_IFCN_DOMAINS,
  REGISTERED_POLL_INSTITUTES,
  TRUSTED_NEWS_DOMAINS
} from '../../services/sourceValidator';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const testInput = ref('');
const testResult = ref<any>(null);

function handleTest() {
  if (!testInput.value.trim()) {
    testResult.value = null;
    return;
  }

  const query = testInput.value.trim();

  // Se parecer com código TSE (BR-XXXXX/2026 ou SP-XXXXX/2026)
  if (/^[A-Z]{2}-\d{4,6}\/\d{4}$/i.test(query)) {
    const pollCheck = validateTseRegistration(query);
    testResult.value = {
      type: 'tse_poll',
      ...pollCheck
    };
    return;
  }

  // Caso seja URL ou domínio
  let url = query;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const urlCheck = validateSourceUrl(url);
  testResult.value = {
    type: 'url',
    ...urlCheck
  };
}

function clearTest() {
  testInput.value = '';
  testResult.value = null;
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
    >
      <!-- Cabeçalho -->
      <div class="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Central de Validação de Fontes Confiáveis
              <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Auditoria Oficial
              </span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Protocolo técnico e apartidário de combate à desinformação eleitoral
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="p-6 space-y-8 text-xs sm:text-sm">
        <!-- 1. Regra Fundamental de Integridade -->
        <div class="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
          <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>Critério Rígido de Homologação de Candidaturas</span>
          </div>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
            A plataforma <strong>Voto Consciente</strong> só exibe figuras públicas no cargo correspondente ao seu 
            <strong>registro oficial homologado no DivulgaCandContas do TSE</strong>. Governadores estaduais que não disputaram a Presidência em 2026 
            (como Tarcísio de Freitas, reeleito Governador de SP no 1º turno com 62,65%, ou Ratinho Júnior no Paraná) e políticos sem registro presidencial (como Ciro Gomes) 
            são terminantemente impedidos de aparecer como candidatos a presidente, figurando com precisão em seus estados ou na seção de apoios declarados do 2º turno (Flávio Bolsonaro vs Lula).
          </p>
        </div>

        <!-- 2. Testador Interativo de Links e Registros -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 class="w-4 h-4 text-emerald-500" />
              <span>Validador Interativo de Fontes em Tempo Real</span>
            </h3>
            <span class="text-[11px] text-slate-400">Cole uma URL ou Registro TSE</span>
          </div>

          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                v-model="testInput"
                @keyup.enter="handleTest"
                type="text"
                placeholder="Ex: BR-09412/2026 ou https://agenciabrasil.ebc.com.br"
                class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <button
                v-if="testInput"
                @click="clearTest"
                class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            <button
              @click="handleTest"
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0"
            >
              Verificar Fonte
            </button>
          </div>

          <!-- Resultado do Teste -->
          <div
            v-if="testResult"
            class="p-4 rounded-2xl border transition-all text-xs"
            :class="testResult.isValid ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <CheckCircle2 v-if="testResult.isValid" class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <XCircle v-else class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span class="font-bold text-slate-900 dark:text-white">
                    {{ testResult.isValid ? 'Fonte Homologada e Aprovada' : 'Fonte Não Homologada (Rejeitada)' }}
                  </span>
                </div>
                <p class="text-slate-600 dark:text-slate-300">
                  {{ testResult.reason }}
                </p>
                <div v-if="testResult.pesqEleUrl" class="pt-1">
                  <a
                    :href="testResult.pesqEleUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Auditar no PesqEle/TSE</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div v-if="testResult.trustScore !== undefined" class="text-right shrink-0">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-md" :class="testResult.trustScore >= 80 ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'">
                  Score {{ testResult.trustScore }}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Os Três Pilares da Informação Verificada -->
        <div class="space-y-4">
          <h3 class="font-extrabold text-slate-900 dark:text-white">
            Os Três Pilares de Auditoria da Informação
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Pilar 1 -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Database class="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1. Dados Oficiais de Estado</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                TSE (DivulgaCandContas e PesqEle), STF, TCU, IBGE e Diário Oficial da União. Informações com fé pública e auditoria judicial.
              </p>
            </div>

            <!-- Pilar 2 -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Award class="w-4 h-4 text-sky-500 shrink-0" />
                <span>2. Fact-Checking IFCN</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Agências certificadas pela International Fact-Checking Network: Agência Lupa, Aos Fatos, Projeto Comprova, Estadão Verifica e G1 Fato ou Fake.
              </p>
            </div>

            <!-- Pilar 3 -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Globe2 class="w-4 h-4 text-purple-500 shrink-0" />
                <span>3. Institutos Registrados</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Pesquisas com registro formal no TSE (Res. 23.600/2019): Datafolha, Quaest, AtlasIntel, Ipec e Paraná Pesquisas com metodologia pública.
              </p>
            </div>
          </div>
        </div>

        <!-- 4. Links Diretos Oficiais para Consulta Pública do Eleitor -->
        <div class="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Canais Públicos Oficiais de Auditoria:
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="https://divulgacandcontas.tse.jus.br"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
            >
              <span class="font-bold text-slate-700 dark:text-slate-200">TSE DivulgaCandContas</span>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://pesqele.tse.jus.br"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
            >
              <span class="font-bold text-slate-700 dark:text-slate-200">TSE PesqEle (Pesquisas)</span>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://www.ibge.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
            >
              <span class="font-bold text-slate-700 dark:text-slate-200">IBGE (Indicadores Oficiais)</span>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://portal.stf.jus.br"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
            >
              <span class="font-bold text-slate-700 dark:text-slate-200">STF (Jurisprudência Constitucional)</span>
              <ExternalLink class="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      <!-- Rodapé -->
      <div class="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <button
          @click="emit('close')"
          class="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
        >
          Entendido e Fechar
        </button>
      </div>
    </div>
  </div>
</template>
