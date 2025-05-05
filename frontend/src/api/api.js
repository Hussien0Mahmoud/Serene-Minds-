import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const therapistApi = {
  getAllTherapists: () => axios.get(`${BASE_URL}/api/therapists`),
  
  getTherapistById: (id) => axios.get(`${BASE_URL}/api/therapists/${id}`),
  
  createTherapist: (data) => {
    return axios.post(`${BASE_URL}/api/therapists/`, {
      user_id: data.user_id,
      specialty: data.specialty,
      experience: data.experience,
      availability: data.availability,
      price: data.price,
      languages: data.languages,
      specializations: data.specializations,
      education: data.education,
      about: data.about,
      time_slots: data.time_slots
    });
  },
  
  updateTherapist: (id, data) => {
    const formData = {
      user: {
        username: data.name,
        email: data.email,
        profile_image: data.image || '',
      },
      specialty: data.specialty,
      experience: data.experience,
      availability: data.availability,
      price: data.price,
      languages: data.languages,
      specializations: data.specializations,
      education: data.education,
      about: data.about,
      time_slots: data.schedule
    };
    return axios.put(`${BASE_URL}/api/therapists/${id}/`, formData);
  },
  
  updateTherapistSchedule: (id, updatedSchedule) => 
    axios.patch(`${BASE_URL}/api/therapists/${id}`, { schedule: updatedSchedule }),

  deleteTherapist: (id) => axios.delete(`${BASE_URL}/api/therapists/${id}/`)
};

export const appointmentApi = {
  getAllAppointments: () => axios.get(`${BASE_URL}/api/appointments`),
  getAppointmentById: (id) => axios.get(`${BASE_URL}/api/appointments/${id}`),
  createAppointment: (data) => axios.post(`${BASE_URL}/api/appointments`, data),
  updateAppointment: (id, data) => axios.put(`${BASE_URL}/api/appointments/${id}`, data),
  deleteAppointment: (id) => axios.delete(`${BASE_URL}/api/appointments/${id}`)
};

export const userApi = {
  getUserProfile: (id) => axios.get(`${BASE_URL}/api/users/${id}`),
  updateUserProfile: (id, data) => axios.put(`${BASE_URL}/api/users/${id}`, data),
  getUserAppointments: (id) => axios.get(`${BASE_URL}/api/users/${id}/appointments`)
};


