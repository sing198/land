import { defineStore } from 'pinia';
import { authApi } from '@/api/authApi';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('alro_user') || 'null'),
    token: localStorage.getItem('alro_token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    roleId: (state) => state.user?.role_id ?? 0,
    roleName: (state) => state.user?.role_name || 'ผู้ใช้งานทั่วไป',
    fullName: (state) => state.user?.full_name || state.user?.username || 'ผู้ใช้งาน',
    isAdmin: (state) => state.user?.role_id === 3,
    isLandOfficer: (state) => state.user?.role_id === 2 || state.user?.role_id === 3,
    isLegalOfficer: (state) => state.user?.role_id === 1 || state.user?.role_id === 3,
    isOfficer: (state) => (state.user?.role_id ?? 0) > 0,
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authApi.login({ username, password });
        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('alro_token', this.token);
        localStorage.setItem('alro_user', JSON.stringify(this.user));
        return this.user;
      } catch (err) {
        this.error = err.message || 'เข้าสู่ระบบไม่สำเร็จ';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return null;
      try {
        const response = await authApi.getMe();
        this.user = response.data;
        localStorage.setItem('alro_user', JSON.stringify(this.user));
        return this.user;
      } catch (err) {
        this.logout();
        return null;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await authApi.logout().catch(() => {});
        }
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('alro_token');
        localStorage.removeItem('alro_user');
      }
    }
  }
});
