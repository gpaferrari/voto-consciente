<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  name: string;
  photoUrl?: string;
  party?: string;
  ballotNumber?: string;
  size?: 'sm' | 'md' | 'lg';
}>(), {
  size: 'md'
});

const imageError = ref(false);

watch(() => props.photoUrl, () => {
  imageError.value = false;
});

const shouldShowImage = computed(() => {
  if (!props.photoUrl || imageError.value) return false;
  // Bloquear fotos genéricas de banco de imagem (Unsplash) para manter seriedade institucional
  if (props.photoUrl.includes('unsplash.com')) return false;
  return true;
});

const initials = computed(() => {
  const clean = (props.name || 'BR').trim();
  const parts = clean.split(/\s+/).filter(p => !['de', 'da', 'do', 'dos', 'das', 'e'].includes(p.toLowerCase()));
  if (parts.length === 0) return 'BR';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const colorClasses = computed(() => {
  const p = (props.party || '').toUpperCase();
  if (p.includes('PT') || p.includes('PSOL') || p.includes('PCDOB')) {
    return 'from-red-900/90 to-slate-900 text-red-100 border-red-500/30';
  }
  if (p.includes('REPUBLICANOS') || p.includes('PL') || p.includes('PP') || p.includes('UNIÃO')) {
    return 'from-blue-900/90 to-slate-900 text-blue-100 border-blue-500/30';
  }
  if (p.includes('PSD') || p.includes('MDB') || p.includes('PSDB') || p.includes('CIDADANIA')) {
    return 'from-sky-900/90 to-slate-900 text-sky-100 border-sky-500/30';
  }
  if (p.includes('PDT') || p.includes('PSB') || p.includes('NOVO')) {
    return 'from-amber-900/90 to-slate-900 text-amber-100 border-amber-500/30';
  }
  return 'from-emerald-900/90 to-slate-900 text-emerald-100 border-emerald-500/30';
});

const textSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-sm';
  if (props.size === 'lg') return 'text-2xl sm:text-3xl';
  return 'text-lg';
});
</script>

<template>
  <div class="relative w-full h-full overflow-hidden select-none">
    <img
      v-if="shouldShowImage"
      :src="photoUrl"
      :alt="name"
      class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      @error="imageError = true"
    />
    <div
      v-else
      :class="[
        'w-full h-full bg-linear-to-br flex flex-col items-center justify-center font-black tracking-wider',
        colorClasses
      ]"
      :title="`${name} (${party || 'Oficial'})`"
    >
      <span :class="[textSizeClass, 'leading-none drop-shadow-xs']">{{ initials }}</span>
    </div>

    <div
      v-if="ballotNumber"
      class="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/85 via-black/50 to-transparent py-0.5 text-center"
    >
      <span class="text-[10px] font-black text-white tracking-widest">{{ ballotNumber }}</span>
    </div>
  </div>
</template>
