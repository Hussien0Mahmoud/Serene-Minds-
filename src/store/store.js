import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Updated path
import therapistReducer from './slices/therapistSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    therapists: therapistReducer,
    notifications: notificationReducer
  }
});

export default store;