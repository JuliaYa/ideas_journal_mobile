import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:8000/api/"; // todo: remove it later from here

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await AsyncStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
          await AsyncStorage.setItem("access", res.data.access);
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api.request(error.config);
        } catch (e) {
          await AsyncStorage.multiRemove(["access", "refresh"]);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
