import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const notificationApi = {
  getAllNotifications: () => axios.get(`${BASE_URL}/api/notifications`),
  
  markAsRead: (id) => axios.patch(`${BASE_URL}/api/notifications/${id}`, { read: true }),
  
  createNotification: (data) => axios.post(`${BASE_URL}/api/notifications`, {
    ...data,
    date: new Date().toISOString(),
    read: false
  }),
  
  deleteNotification: (id) => axios.delete(`${BASE_URL}/api/notifications/${id}`)
};