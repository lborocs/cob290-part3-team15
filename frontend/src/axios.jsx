import axios from 'axios';

axios.interceptors.response.use(
  res => res,
  async error => {
    const isTokenExpired = error.response?.status === 401;

    if (isTokenExpired && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post('/auth/token', { token: refreshToken });
        const newToken = res.data.accessToken;

        localStorage.setItem('accessToken', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        error.config.headers['Authorization'] = `Bearer ${newToken}`;

        return axios(error.config);
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);