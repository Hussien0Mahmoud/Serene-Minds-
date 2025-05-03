import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const appointmentApi = {
  createAppointment: (appointmentData) => {
    return axios.post(`${BASE_URL}/api/appointments`, appointmentData);
  },

  updateDoctorSchedule: (doctorId, updatedSchedule) => {
    return axios.patch(`${BASE_URL}/api/therapists/${doctorId}`, {
      schedule: updatedSchedule
    });
  }
};