<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Navbar -->
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex-1 flex">
      <!-- Sidebar -->
      <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main Content Area -->
      <main
        :class="[
          'flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        ]"
      >
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/common/Navbar.vue';
import Sidebar from '@/components/common/Sidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import { useCommonStore } from '@/stores/commonStore';

const authStore = useAuthStore();
const commonStore = useCommonStore();
const sidebarOpen = ref(true);

onMounted(() => {
  // If window is small, collapse sidebar by default
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }

  // Preload master data & current user profile
  commonStore.fetchMasterData();
  if (authStore.token) {
    authStore.fetchMe();
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
