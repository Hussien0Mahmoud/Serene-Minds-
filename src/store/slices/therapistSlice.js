import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  therapists: [],
  selectedTherapist: null,
  loading: false,
  error: null
};

const therapistSlice = createSlice({
  name: 'therapists',
  initialState,
  reducers: {
    setTherapists: (state, action) => {
      state.therapists = action.payload;
    },
    setSelectedTherapist: (state, action) => {
      state.selectedTherapist = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setTherapists, setSelectedTherapist, setLoading, setError } = therapistSlice.actions;
export default therapistSlice.reducer;