import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://sp-taskify-api.vercel.app/1-3/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userDataString = localStorage.getItem('taskifyUserData');

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      const token = userData.accessToken;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  },
);
