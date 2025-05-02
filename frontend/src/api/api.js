import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Therapist endpoints
export const therapistApi = {
  getAllTherapists: () => axios.get(`${BASE_URL}/therapists`),
  
  getTherapistById: (id) => axios.get(`${BASE_URL}/therapists/${id}`),
  
  createTherapist: (data) => {
    const newTherapist = {
      ...data,
      id: Date.now().toString(),
      role: "therapist",
      rating: 0,
      reviews: 0,
      image: `https://ui-avatars.com/api/?name=${data.name.replace(/ /g, '+')}`,
      password: "123456",
      schedule: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
      },
      education: data.education || [],
      languages: data.languages || [],
      specializations: data.specializations || [],
      about: data.about || `Experienced ${data.specialty} with ${data.experience} of experience`,
      price: data.price || 0,
      availability: data.availability || false
    };
    return axios.post(`${BASE_URL}/therapists`, newTherapist);
  },
  
  updateTherapist: (id, data) => {
    const updatedTherapist = {
      ...data,
      image: data.image || `https://ui-avatars.com/api/?name=${data.name.replace(/ /g, '+')}`,
      education: data.education || [],
      languages: data.languages || [],
      specializations: data.specializations || [],
      price: data.price || 0,
      availability: data.availability || false
    };
    return axios.patch(`${BASE_URL}/therapists/${id}`, updatedTherapist);
  },
  
  updateTherapistSchedule: (id, updatedSchedule) => 
    axios.patch(`${BASE_URL}/therapists/${id}`, { schedule: updatedSchedule }),

  deleteTherapist: (id) => axios.delete(`${BASE_URL}/therapists/${id}`)
};

// Appointment endpoints
export const appointmentApi = {
  getAllAppointments: () => axios.get(`${BASE_URL}/appointments`),
  getAppointmentById: (id) => axios.get(`${BASE_URL}/appointments/${id}`),
  createAppointment: (data) => axios.post(`${BASE_URL}/appointments`, data),
  updateAppointment: (id, data) => axios.put(`${BASE_URL}/appointments/${id}`, data),
  deleteAppointment: (id) => axios.delete(`${BASE_URL}/appointments/${id}`)
};

// User endpoints
export const userApi = {
  getUserProfile: (id) => axios.get(`${BASE_URL}/users/${id}`),
  updateUserProfile: (id, data) => axios.put(`${BASE_URL}/users/${id}`, data),
  getUserAppointments: (id) => axios.get(`${BASE_URL}/users/${id}/appointments`)
};