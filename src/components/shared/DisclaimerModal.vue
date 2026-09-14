<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseModal from './BaseModal.vue';
import { ShieldCheck, Check, Info } from 'lucide-vue-next';

const isOpen = ref(false);
const dontShowAgain = ref(true);

onMounted(() => {
  const accepted = localStorage.getItem('voto_consciente_disclaimer_accepted');
  if (!accepted) {
    // Pequeno delay para animação suave após carregamento
    setTimeout(() => {
      isOpen.value = true;
    }, 400);
  }
});

function handleAcknowledge() {
  if (dontShowAgain.value) {
    localStorage.setItem('voto_consciente_disclaimer_accepted', 'true');
  }
  isOpen.value = false;
}

// Expõe método para reabertura manual pelo footer
function openManually() {
  isOpen.value = true;
}

defineExpose({ openManually });
</script>

<template>
  <BaseModal :isOpen="isOpen" maxWidth="max-w-md" @close="handleAcknowledge">
    <template #header>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Aviso Institucional & Apartidarismo</h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Finalidade estritamente cívica e informativa</p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          Bem-vindo à plataforma <strong>Voto Consciente</strong>. Antes de navegar pelas avaliações, reafirmamos os princípios fundamentais deste projeto:
        </p>

        <div class="space-y-2.5 pt-1">
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <strong class="text-slate-900 dark:text-white block font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Isenção Partidária Estrita
            </strong>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Não temos preferência, vínculo ou financiamento de qualquer partido, candidato ou coligação.
            </p>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <strong class="text-slate-900 dark:text-white block font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Apenas Fatos Comprovados & Dados Oficiais
            </strong>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              As notas são calculadas matematicamente a partir de bases do TSE, IBGE, Banco Central, tribunais superiores e agências de checagem certificadas (IFCN).
            </p>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <strong class="text-slate-900 dark:text-white block font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Autonomia do Eleitor
            </strong>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Você pode recalibrar os pesos do score no menu superior a qualquer momento de acordo com suas próprias prioridades.
            </p>
          </div>
        </div>

        <label class="flex items-center gap-2 pt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            v-model="dontShowAgain"
            class="rounded-sm border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 text-xs"
          />
          <span class="text-[11px] text-slate-500 dark:text-slate-400">Não exibir este aviso novamente neste navegador</span>
        </label>
      </div>
    </template>

    <template #footer>
      <button
        @click="handleAcknowledge"
        class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-2"
      >
        <Check class="w-3.5 h-3.5" />
        <span>Compreendo e Desejo Acessar</span>
      </button>
    </template>
  </BaseModal>
</template>
