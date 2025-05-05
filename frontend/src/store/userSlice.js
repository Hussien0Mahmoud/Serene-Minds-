import { createSlice } from '@reduxjs/toolkit';

const loadUser = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    if (serializedUser === null) return null;
    return JSON.parse(serializedUser);
  } catch (err) {
    return null;
  }
};

const initialState = {
  currentUser: loadUser(),
  isAuthenticated: !!loadUser(),
  error: null,
  loading: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  loginSuccess, 
  logoutSuccess, 
  clearError 
} = userSlice.actions;

export default userSlice.reducer;