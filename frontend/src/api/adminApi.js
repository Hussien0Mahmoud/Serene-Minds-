import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const adminApi = {
  getStats: () => {
    return axios.get(`${BASE_URL}/admin-stats/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
  }
};