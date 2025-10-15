import { SecureTokenStorage } from '@/components/biometrics/secure-token-storage';
import useAuthStore from '@/hooks/use-auth-store';
import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://192.168.1.165:7081/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureTokenStorage.getAccessToken(false);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await useAuthStore.getState().logOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data;
    await SecureTokenStorage.saveAccessToken(newAccessToken);
    useAuthStore.getState().setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await useAuthStore.getState().logOut();
    return null;
  }
}

// Custom instance for orval
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient(config).then(({ data }) => data);
};