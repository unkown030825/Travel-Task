import { configureStore } from '@reduxjs/toolkit';
import experiencesReducer from './experiencesSlice';
import bookingReducer from './bookingSlice';

export const store = configureStore({
  reducer: {
    experiences: experiencesReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
