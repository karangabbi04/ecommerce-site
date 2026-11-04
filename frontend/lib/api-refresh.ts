import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,

});

let refreshRequest: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status !== 401 || !request || request._retry) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      if (!refreshRequest) {
        const baseURL = api.defaults.baseURL?.replace(/\/$/, "") ?? "";
        refreshRequest = axios
          .post(`${baseURL}/auth/refresh`, undefined, { withCredentials: true })
          .then(() => undefined)
          .finally(() => {
            refreshRequest = null;
          });
      }

      await refreshRequest;
      return api(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);