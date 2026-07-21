import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async (_, thunkAPI) => {
  try {
    const response = await api.get('/events', { withCredentials: true });
    const events = response.data.data;
    const upcoming = events.filter((event) => new Date(event.date) > new Date());
    return {
      totalEvents: events.length,
      upcomingEvents: upcoming.length,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to fetch dashboard' });
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totalEvents: 0,
    upcomingEvents: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.totalEvents = action.payload.totalEvents;
        state.upcomingEvents = action.payload.upcomingEvents;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default dashboardSlice.reducer;
