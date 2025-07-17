import axios from "axios";
const instance = axios.create({
  baseURL: 'http://localhost:8083/api',
});

instance.interceptors.request.use(
  (config) => {
    // Add any request interceptors here if needed
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        }
    return config;
  });

  export default instance;