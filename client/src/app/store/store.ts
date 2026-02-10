import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/auth.slice';
import opportunitiesReducer from '../../features/opportunities/opportunities.slice';
import { apiSlice } from '../../shared/api/api.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    opportunities: opportunitiesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;