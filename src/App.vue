<script setup lang="ts">
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import DisclaimerModal from './components/shared/DisclaimerModal.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
    <Navbar />
    
    <main class="grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
    
    <!-- Modal de Aviso Ético / Apartidário com verificação em cache -->
    <DisclaimerModal />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
