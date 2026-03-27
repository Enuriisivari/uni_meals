import axios from "axios";

const SESSION_KEY = "canteenStaffSession";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(SESSION_KEY);

  if (!storedSession) {
    return config;
  }

  try {
    const session = JSON.parse(storedSession);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }

  return config;
});

export default api;
