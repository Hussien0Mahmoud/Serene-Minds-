import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    selectedAppointment: null,
    loading: false,
    error: null
  },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(apt => apt.id !== action.payload);
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateDoctorSchedule: (state, action) => {
      const { doctorId, date, time } = action.payload;
      // Update the schedule if needed in the store
    }
  }
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setSelectedAppointment,
  setLoading,
  setError,
  updateDoctorSchedule
} = appointmentSlice.actions;

export default appointmentSlice.reducer;