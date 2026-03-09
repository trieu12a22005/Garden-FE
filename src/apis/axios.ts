import axios from 'axios';


export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Request interceptor - tự động thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Response interceptor - xử lý lỗi chung
// apiClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token hết hạn - redirect về login
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
