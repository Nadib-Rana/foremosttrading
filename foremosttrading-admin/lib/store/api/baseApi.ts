import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:3030',
    prepareHeaders: (headers, { getState }) => {
      // Access token from Redux state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'User', 'Auth','ProductShape'],
  endpoints: () => ({}), // Endpoints are injected from other files
});
