import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Views
import MapExplorerView from '@/views/map/MapExplorerView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import PublicSearchView from '@/views/public/PublicSearchView.vue';
import LoginView from '@/views/auth/LoginView.vue';

import LandListView from '@/views/lands/LandListView.vue';
import LandDetailView from '@/views/lands/LandDetailView.vue';
import LandFormView from '@/views/lands/LandFormView.vue';

import CitizenListView from '@/views/citizens/CitizenListView.vue';
import CitizenDetailView from '@/views/citizens/CitizenDetailView.vue';
import CitizenFormView from '@/views/citizens/CitizenFormView.vue';

import HeirFormView from '@/views/heirs/HeirFormView.vue';
import NotFoundView from '@/views/errors/NotFoundView.vue';

const routes = [
  {
    path: '/',
    name: 'MapExplorer',
    component: MapExplorerView,
    meta: { title: 'แผนที่แปลงที่ดิน (GIS) | ส.ป.ก.' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'แดชบอร์ดสถิติ | ส.ป.ก.' }
  },
  {
    path: '/search',
    name: 'PublicSearch',
    component: PublicSearchView,
    meta: { title: 'สืบค้นแปลงที่ดิน ส.ป.ก. 4-01 | ประชาชน' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'เข้าสู่ระบบเจ้าหน้าที่ | ส.ป.ก.', guestOnly: true }
  },

  // Land Management Routes (Officers & Admin)
  {
    path: '/lands',
    name: 'LandList',
    component: LandListView,
    meta: { title: 'จัดการแปลงที่ดิน | ส.ป.ก.', minRole: 1 }
  },
  {
    path: '/lands/create',
    name: 'LandCreate',
    component: LandFormView,
    meta: { title: 'เพิ่มแปลงที่ดินใหม่ | ส.ป.ก.', minRole: 2 }
  },
  {
    path: '/lands/:id',
    name: 'LandDetail',
    component: LandDetailView,
    meta: { title: 'รายละเอียดแปลงที่ดิน | ส.ป.ก.', minRole: 1 }
  },
  {
    path: '/lands/:id/edit',
    name: 'LandEdit',
    component: LandFormView,
    meta: { title: 'แก้ไขแปลงที่ดิน | ส.ป.ก.', minRole: 2 }
  },

  // Citizen Management Routes
  {
    path: '/citizens',
    name: 'CitizenList',
    component: CitizenListView,
    meta: { title: 'ทะเบียนข้อมูลราษฎร | ส.ป.ก.', minRole: 1 }
  },
  {
    path: '/citizens/create',
    name: 'CitizenCreate',
    component: CitizenFormView,
    meta: { title: 'เพิ่มข้อมูลราษฎรใหม่ | ส.ป.ก.', minRole: 2 }
  },
  {
    path: '/citizens/:id_card',
    name: 'CitizenDetail',
    component: CitizenDetailView,
    meta: { title: 'ประวัติข้อมูลราษฎร | ส.ป.ก.', minRole: 1 }
  },
  {
    path: '/citizens/:id_card/edit',
    name: 'CitizenEdit',
    component: CitizenFormView,
    meta: { title: 'แก้ไขข้อมูลราษฎร | ส.ป.ก.', minRole: 2 }
  },

  // Heir Management Routes
  {
    path: '/heirs/create',
    name: 'HeirCreate',
    component: HeirFormView,
    meta: { title: 'เพิ่มและผูกสิทธิ์ทายาท | ส.ป.ก.', minRole: 2 }
  },

  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 ไม่พบหน้า | ส.ป.ก.' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation Guard for RBAC
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Set Document Title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Guest Only (e.g. Login page)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/');
  }

  // Role Requirement Check
  if (to.meta.minRole !== undefined) {
    if (!authStore.isAuthenticated) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (authStore.roleId < to.meta.minRole) {
      return next('/');
    }
  }

  next();
});

export default router;
