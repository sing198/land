import apiClient from './client';

export const landApi = {
  getLands(params = {}) {
    return apiClient.get('/lands', { params });
  },
  getLandDetail(id) {
    return apiClient.get(`/lands/${id}`);
  },
  publicSearch(query) {
    return apiClient.get('/lands/public-search', { params: { q: query } });
  },
  createLand(data) {
    return apiClient.post('/lands', data);
  },
  updateLand(id, data) {
    return apiClient.put(`/lands/${id}`, data);
  },
  deleteLand(id) {
    return apiClient.delete(`/lands/${id}`);
  },
  getMapPolygons() {
    return apiClient.get('/lands/map-polygons');
  },
  uploadDocument(formData) {
    return apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteDocument(fileId) {
    return apiClient.delete(`/files/${fileId}`);
  }
};
