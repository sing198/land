import apiClient from './client';

export const heirApi = {
  getHeirsByCitizen(citizenId) {
    return apiClient.get(`/heirs/citizen/${citizenId}`);
  },
  createHeir(data) {
    return apiClient.post('/heirs', data);
  },
  deleteRelationship(citizenId, heirId) {
    return apiClient.delete(`/heirs/citizen/${citizenId}/heir/${heirId}`);
  }
};
