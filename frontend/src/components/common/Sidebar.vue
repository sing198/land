<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-16 left-0 bottom-0 bg-white border-r border-slate-200 z-40 transition-all duration-300 flex flex-col',
        isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      ]"
    >
      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <template v-for="item in menuItems" :key="item.path">
          <router-link
            v-if="!item.requiresRole || item.requiresRole(authStore.roleId)"
            :to="item.path"
            @click="handleNavClick"
            :class="[
              'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition group relative',
              $route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            <!-- Icon -->
            <div class="w-6 h-6 shrink-0 flex items-center justify-center">
              <component :is="item.icon" class="w-5 h-5" />
            </div>

            <!-- Title -->
            <span
              :class="[
                'ml-3 transition-opacity duration-200 whitespace-nowrap',
                isOpen ? 'opacity-100' : 'opacity-0 lg:hidden'
              ]"
            >
              {{ item.title }}
            </span>

            <!-- Tooltip for collapsed sidebar -->
            <div
              v-if="!isOpen"
              class="hidden lg:group-hover:flex absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded-md shadow-md whitespace-nowrap z-50 pointer-events-none items-center"
            >
              {{ item.title }}
            </div>
          </router-link>
        </template>
      </nav>

      <!-- Bottom System Status -->
      <div class="p-3 border-t border-slate-200">
        <div
          :class="[
            'p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3',
            !isOpen ? 'justify-center' : ''
          ]"
        >
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
          <div v-if="isOpen" class="text-xs text-slate-500 truncate">
            <span class="font-semibold text-slate-700">ระบบ ส.ป.ก. 4-01</span>
            <p>ระบบออนไลน์พร้อมใช้งาน</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { h } from 'vue';
import { useAuthStore } from '@/stores/authStore';

defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const handleNavClick = () => {
  if (window.innerWidth < 1024) {
    emit('close');
  }
};

// SVG Icon Helpers
const IconHome = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
]);

const IconMap = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' })
]);

const IconDashboard = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
]);

const IconLands = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
]);

const IconPeople = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
]);

const IconAddLand = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' })
]);

const IconAddPeople = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' })
]);

const IconHeir = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
]);

const IconSearch = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
]);

const menuItems = [
  {
    title: 'แผนที่แปลงที่ดิน (GIS)',
    path: '/',
    icon: IconMap,
  },
  {
    title: 'แดชบอร์ดสถิติ',
    path: '/dashboard',
    icon: IconDashboard,
  },
  {
    title: 'สืบค้นข้อมูลประชาชน',
    path: '/search',
    icon: IconSearch,
  },
  {
    title: 'จัดการแปลงที่ดิน',
    path: '/lands',
    icon: IconLands,
    requiresRole: (role) => role >= 1, // Legal, Land Reform, Admin
  },
  {
    title: 'เพิ่มแปลงที่ดินใหม่',
    path: '/lands/create',
    icon: IconAddLand,
    requiresRole: (role) => role >= 2, // Land Reform, Admin
  },
  {
    title: 'ข้อมูลราษฎร',
    path: '/citizens',
    icon: IconPeople,
    requiresRole: (role) => role >= 1,
  },
  {
    title: 'เพิ่มราษฎรใหม่',
    path: '/citizens/create',
    icon: IconAddPeople,
    requiresRole: (role) => role >= 2,
  },
  {
    title: 'จัดการทายาท',
    path: '/heirs/create',
    icon: IconHeir,
    requiresRole: (role) => role >= 2,
  },
];
</script>
