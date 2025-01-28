import { defineStore } from 'pinia';
import { commonApi } from '@/api/commonApi';

export const useCommonStore = defineStore('common', {
  state: () => ({
    prefixes: [],
    relationships: [],
    landStatuses: [],
    alleys: [],
    isLoaded: false,
    loading: false,
  }),

  actions: {
    async fetchMasterData(force = false) {
      if (this.isLoaded && !force) return;
      this.loading = true;
      try {
        const res = await commonApi.getMasterData();
        if (res.data) {
          this.prefixes = res.data.prefixes || [];
          this.relationships = res.data.relationships || [];
          this.landStatuses = res.data.landStatuses || [];
          this.alleys = res.data.alleys || [];
          this.isLoaded = true;
        }
      } catch (error) {
        console.error('Failed to load master data:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});
