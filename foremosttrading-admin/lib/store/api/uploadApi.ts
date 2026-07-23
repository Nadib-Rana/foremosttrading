import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/upload/admin/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadSvg: builder.mutation({
      query: (formData) => ({
        url: '/uploads/svg',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFileMutation, useUploadSvgMutation } = uploadApi;
