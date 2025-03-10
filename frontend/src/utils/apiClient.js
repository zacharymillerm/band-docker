import axios from "axios";
import endpoint from "../config/config";
import { logout } from "@/api";

const BASE_URL = `${endpoint}/api`;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export { apiClient };