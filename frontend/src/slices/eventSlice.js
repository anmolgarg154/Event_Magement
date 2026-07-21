import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
  try {
    const response = await api.get('/events');
    return response.data.data;
  } catch (error) {
    toast.warn(error.response?.data || { message: 'Unable to fetch events' })
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to fetch events' });
  }
});

export const fetchMyEvents = createAsyncThunk('events/fetchMyEvents', async (_, thunkAPI) => {
  try {
    const response = await api.get('/events/mine', { withCredentials: true });
    return response.data.data;
  } catch (error) {
    toast.warn(error.response?.data || { message: 'Unable to fetch user events' })
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to fetch user events' });
  }
});

export const createEvent = createAsyncThunk('events/createEvent', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/events', payload, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    toast.warn(error.response?.data || { message: 'Unable to create event' })
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to create event' });
  }
});

export const updateEvent = createAsyncThunk('events/updateEvent', async ({ id, payload }, thunkAPI) => {
  try {
    const response = await api.put(`/events/${id}`, payload, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    toast.warn(error.response?.data || { message: 'Unable to update event' })
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to update event' });
  }
});

export const deleteEvent = createAsyncThunk('events/deleteEvent', async (id, thunkAPI) => {
  try {
    await api.delete(`/events/${id}`, { withCredentials: true });
    return id;
  } catch (error) {
    toast.warn(error.response?.data || { message: 'Unable to delete event' })
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Unable to delete event' });
  }
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    myEvents: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEventError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.myEvents = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.myEvents.unshift(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.list = state.list.map((event) => (event.id === action.payload.id ? action.payload : event));
        state.myEvents = state.myEvents.map((event) => (event.id === action.payload.id ? action.payload : event));
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter((event) => event.id !== action.payload);
        state.myEvents = state.myEvents.filter((event) => event.id !== action.payload);
      });
  },
});

export const { clearEventError } = eventSlice.actions;
export default eventSlice.reducer;
