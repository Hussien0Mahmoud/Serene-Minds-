import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const appointmentApi = {
  createAppointment: (appointmentData) => {
    return axios.post(`${BASE_URL}/appointments`, appointmentData);
  },

  updateDoctorSchedule: (doctorId, updatedSchedule) => {
    return axios.patch(`${BASE_URL}/therapists/${doctorId}`, {
      schedule: updatedSchedule
    });
  }
};