import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import opportunitiesReducer from '../features/opportunities/opportunities.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    opportunities: opportunitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;