<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Toggle Sidebar & Logo Title -->
        <div class="flex items-center space-x-3">
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-hidden transition"
            aria-label="Toggle Sidebar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ส
            </div>
            <div>
              <h1 class="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                ระบบจัดการที่ดิน ส.ป.ก.
              </h1>
              <p class="text-xs text-slate-500 hidden sm:block">
                ALRO Land & Citizen Management System
              </p>
            </div>
          </div>
        </div>

        <!-- Center: Quick Search Bar for Public/Users -->
        <div class="hidden md:flex flex-1 max-w-md mx-6">
          <form @submit.prevent="handleQuickSearch" class="w-full relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาแปลงเลขที่ (เช่น SPK-001, SPK-002)..."
              class="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>
        </div>

        <!-- Right: User Profile & Actions -->
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div class="hidden sm:block text-right">
                <div class="text-sm font-semibold text-slate-800">{{ authStore.fullName }}</div>
                <div class="text-xs text-emerald-600 font-medium">{{ authStore.roleName }}</div>
              </div>

              <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200">
                {{ authStore.fullName.charAt(0) }}
              </div>

              <button
                @click="handleLogout"
                title="ออกจากระบบ"
                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
            >
              เข้าสู่ระบบเจ้าหน้าที่
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();
const searchQuery = ref('');

const handleQuickSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } });
  }
};

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'ยืนยันการออกจากระบบ?',
    text: 'คุณต้องการออกจากระบบบริหารจัดการหรือไม่',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก'
  });

  if (result.isConfirmed) {
    await authStore.logout();
    router.push('/login');
  }
};
</script>
