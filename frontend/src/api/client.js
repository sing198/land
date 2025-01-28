import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';

    if (status === 401) {
      localStorage.removeItem('alro_token');
      localStorage.removeItem('alro_user');
      // If unauthorized on protected route, redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/search')) {
        Swal.fire({
          icon: 'warning',
          title: 'เซสชันหมดอายุ',
          text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
          confirmButtonColor: '#16a34a',
        }).then(() => {
          window.location.href = '/login';
        });
      }
    }

    return Promise.reject({
      status,
      message,
      errors: error.response?.data?.errors || null,
      raw: error
    });
  }
);

export default apiClient;
