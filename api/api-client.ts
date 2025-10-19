import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://192.168.1.165:7081';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

let getClerkToken: (() => Promise<string | null>) | null = null;

export const setupClerkToken = (getTokenFn: () => Promise<string | null>) => {
  getClerkToken = getTokenFn;
};

apiClient.interceptors.request.use(
  async (config) => {
    if (getClerkToken) {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        if (getClerkToken) {
          const newToken = await getClerkToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return apiClient(config).then(({ data }) => data);
};