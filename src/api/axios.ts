import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import store from '../store/store';
import { logout, refreshAccessToken } from '../store/LoginStatusSlice';

// API 기본 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers['access'] = accessToken;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: AxiosError) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['access'] = token;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios.post(`${API_BASE_URL}/reissue`, {}, { withCredentials: true })
          .then(({ headers }) => {
            const accessToken = headers['access'];
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
              store.dispatch(refreshAccessToken({ accessToken }));
              api.defaults.headers.common['access'] = accessToken;
              processQueue(null, accessToken);
              resolve(api(originalRequest));
            } else {
              processQueue(error, null);
              store.dispatch(logout());
              reject(error);
            }
          })
          .catch((err) => {
            processQueue(err, null);
            store.dispatch(logout());
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // 에러 메시지 처리
    if (error.response) {
      const responseData = error.response.data as { message?: string };
      const message = responseData?.message || '요청 처리 중 오류가 발생했습니다.';
      return Promise.reject({ ...error, message });
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API 헬퍼 함수들
export const apiHelpers = {
  // GET 요청
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  },

  // POST 요청
  post: async <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  },

  // PUT 요청
  put: async <T>(url: string, data?: Record<string, unknown>): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  },

  // DELETE 요청
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },
};