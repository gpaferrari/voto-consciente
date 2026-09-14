<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  maxWidth?: string;
  showCloseButton?: boolean;
}>(), {
  maxWidth: 'max-w-lg',
  showCloseButton: true
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none"
        @click.self="$emit('close')"
      >
        <div
          :class="[
            'w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transform transition-all duration-200',
            maxWidth
          ]"
        >
          <!-- Cabeçalho do Modal -->
          <div class="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <slot name="header">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Aviso</h3>
              </slot>
            </div>
            <button
              v-if="showCloseButton"
              @click="$emit('close')"
              class="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Corpo -->
          <div class="p-5 md:p-6 max-h-[75vh] overflow-y-auto">
            <slot name="body" />
          </div>

          <!-- Rodapé -->
          <div v-if="$slots.footer" class="p-4 md:p-5 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2.5">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
