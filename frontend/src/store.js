import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import eventReducer from './slices/eventSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
