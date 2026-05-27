import axios, { AxiosError } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }

  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

type AuthInterceptorConfig = {
  refreshAccessToken: () => Promise<unknown>;
  onAuthFailure: () => void;
};

let authInterceptorConfig: AuthInterceptorConfig | null = null;
let refreshPromise: Promise<void> | null = null;
let isHandlingAuthFailure = false;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const configureAuthInterceptors = (config: AuthInterceptorConfig) => {
  authInterceptorConfig = config;
};

const shouldSkipAuthRefresh = (url?: string) => {
  if (!url) {
    return false;
  }

  return url.includes('/auth/login') || url.includes('/auth/refresh');
};

const handleAuthFailure = () => {
  if (isHandlingAuthFailure) {
    return;
  }

  isHandlingAuthFailure = true;
  authInterceptorConfig?.onAuthFailure();

  // Reset flag after a short delay to allow subsequent auth failures after re-login
  setTimeout(() => {
    isHandlingAuthFailure = false;
  }, 1000);
};

// Add request interceptor to include Authorization header
apiClient.interceptors.request.use((config) => {
  const stateStr = localStorage.getItem('garden-auth');
  if (stateStr) {
    try {
      const state = JSON.parse(stateStr);
      if (state.state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.state.accessToken}`;
      }
    } catch (e) { }
  }
  return config;
});

const refreshAccessToken = async () => {
  if (!authInterceptorConfig) {
    throw new Error('Auth interceptors are not configured.');
  }

  if (!refreshPromise) {
    refreshPromise = authInterceptorConfig
      .refreshAccessToken()
      .then((res: any) => {
        // Save new tokens
        const stateStr = localStorage.getItem('garden-auth');
        if (stateStr) {
          try {
            const state = JSON.parse(stateStr);
            state.state.accessToken = res.accessToken;
            if (res.refreshToken) {
              state.state.refreshToken = res.refreshToken;
            }
            localStorage.setItem('garden-auth', JSON.stringify(state));
          } catch (e) { }
        }
        return undefined;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    if (
      originalRequest._retry ||
      originalRequest.skipAuthRefresh ||
      shouldSkipAuthRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return apiClient(originalRequest);
    } catch (refreshError) {
      handleAuthFailure();
      return Promise.reject(refreshError);
    }
  }
);
