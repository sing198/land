import apiClient from './client';

export const commonApi = {
  getMasterData() {
    return apiClient.get('/common/master-data');
  },
  getPrefixes() {
    return apiClient.get('/common/prefixes');
  },
  getRelationships() {
    return apiClient.get('/common/relationships');
  },
  getLandStatuses() {
    return apiClient.get('/common/land-statuses');
  },
  getAlleys() {
    return apiClient.get('/common/alleys');
  }
};
