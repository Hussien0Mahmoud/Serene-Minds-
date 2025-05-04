import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const appointmentApi = {
  createAppointment: (data) => {
    const token = localStorage.getItem('access_token');
    return axios.post(`${BASE_URL}/appointments/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },

  updateDoctorSchedule: (doctorId, updatedSchedule) => {
    return axios.patch(`${BASE_URL}/therapists/${doctorId}`, {
      schedule: updatedSchedule
    });
  }
};