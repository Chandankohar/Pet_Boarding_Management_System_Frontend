import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://pet-boarding-management-system-backend.onrender.com/api/",
  withCredentials: true,
});

export default axiosInstance;
