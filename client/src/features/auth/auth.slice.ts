import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  awardedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'admin';
  skills: string[]; 
  availability: Availability[]; 
  backgroundCheckStatus: 'pending' | 'passed' | 'failed';
  badges: Badge[];
  createdAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;