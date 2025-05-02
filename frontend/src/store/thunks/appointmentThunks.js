import { createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentApi } from '../../api/api';

import { 
  setLoading, 
  setError, 
  setAppointments, 
  addAppointment, 
  updateAppointment as updateAppointmentAction,
  deleteAppointment as deleteAppointmentAction
} from '../slices/appointmentSlice';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await appointmentApi.getAllAppointments();
      dispatch(setAppointments(response.data));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await appointmentApi.createAppointment(appointmentData);
      dispatch(addAppointment(response.data));
      dispatch(setError(null));
      return response.data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);