import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id?: string;
  email?: string;
  fullName?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Check localStorage for initial token if in browser environment
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

const initialToken = getInitialToken();

const initialState: AuthState = {
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isLoading: true, // or false depending on whether you want to fetch user first
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', action.payload.token);
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!state.token;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
