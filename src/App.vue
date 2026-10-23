<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import Footer from './components/layout/Footer.vue';
import DisclaimerModal from './components/shared/DisclaimerModal.vue';
import WeightCustomizerModal from './components/shared/WeightCustomizerModal.vue';
import TrustedSourcesModal from './components/common/TrustedSourcesModal.vue';

const isMobileSidebarOpen = ref(false);
const isWeightsModalOpen = ref(false);
const isTrustModalOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden transition-colors duration-200">
    <!-- Top Header (Breadcrumb, Global Search, UF, Tools, Dark Mode) -->
    <AppHeader 
      @toggle-mobile-menu="isMobileSidebarOpen = !isMobileSidebarOpen"
      @open-weights="isWeightsModalOpen = true"
      @open-trust="isTrustModalOpen = true"
    />

    <!-- Main Workspace Container: Notion / Jira Sidebar + Content -->
    <div class="flex-1 flex w-full relative overflow-x-hidden min-h-0">
      <!-- Collapsible Sidebar -->
      <AppSidebar 
        v-model:isMobileOpen="isMobileSidebarOpen"
        @open-weights="isWeightsModalOpen = true"
        @open-trust="isTrustModalOpen = true"
      />

      <!-- Main Content Column -->
      <div class="flex-1 flex flex-col min-w-0 w-full overflow-y-auto">
        <main class="flex-1 w-full min-w-0">
          <router-view :key="$route.fullPath" />
        </main>

        <Footer />
      </div>
    </div>

    <!-- Modals Globais com controle via Header e Sidebar -->
    <WeightCustomizerModal
      :isOpen="isWeightsModalOpen"
      @close="isWeightsModalOpen = false"
    />

    <TrustedSourcesModal
      :isOpen="isTrustModalOpen"
      @close="isTrustModalOpen = false"
    />

    <!-- Modal de Aviso Ético / Apartidário com verificação em cache -->
    <DisclaimerModal />
  </div>
</template>
