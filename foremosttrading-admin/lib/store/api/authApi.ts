import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/v1/admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => ({
        url: '/auth/v1/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getAdminCustomers: builder.query({
      query: () => ({
        url: '/admin/customers',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useGetAdminCustomersQuery } = authApi;
