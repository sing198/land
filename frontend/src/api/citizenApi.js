import apiClient from './client';

export const citizenApi = {
  getCitizens(params = {}) {
    return apiClient.get('/citizens', { params });
  },
  getCitizenDetail(idCard) {
    return apiClient.get(`/citizens/${idCard}`);
  },
  autocomplete(query) {
    return apiClient.get('/citizens/autocomplete', { params: { q: query } });
  },
  createCitizen(data) {
    return apiClient.post('/citizens', data);
  },
  updateCitizen(idCard, data) {
    return apiClient.put(`/citizens/${idCard}`, data);
  },
  deleteCitizen(idCard) {
    return apiClient.delete(`/citizens/${idCard}`);
  }
};
