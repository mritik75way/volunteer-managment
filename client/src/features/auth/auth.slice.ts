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

const saveTokenToStorage = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('accessToken');
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const removeTokenFromStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  accessToken: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
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
      saveTokenToStorage(action.payload.accessToken);
      saveUserToStorage(action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      removeTokenFromStorage();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;