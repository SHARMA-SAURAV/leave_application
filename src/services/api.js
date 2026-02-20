import axios from "axios";
const instance = axios.create({
  // baseURL: 'http://10.248.0.37:8083/api',
  baseURL: 'http://localhost:8083/api',
  // baseURL: 'https://leave-applicaiton-latest.onrender.com/api',
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
