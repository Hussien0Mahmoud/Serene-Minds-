import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const notificationApi = {
  getAllNotifications: () => axios.get(`${BASE_URL}/notifications`),
  
  markAsRead: (id) => axios.patch(`${BASE_URL}/notifications/${id}`, { read: true }),
  
  createNotification: (data) => axios.post(`${BASE_URL}/notifications`, {
    ...data,
    date: new Date().toISOString(),
    read: false
  }),
  
  deleteNotification: (id) => axios.delete(`${BASE_URL}/notifications/${id}`)
};