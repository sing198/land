import apiClient from './client';

export const dashboardApi = {
  getDashboardData(soi = null) {
    return apiClient.get('/dashboard', { params: { soi } });
  }
};
