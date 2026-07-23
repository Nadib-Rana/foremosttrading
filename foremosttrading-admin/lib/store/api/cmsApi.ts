import { baseApi } from './baseApi';

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCms: builder.query({
      query: () => ({ url: '/admin/cms' }),
      providesTags: ['User' as any],
    }),
    createCmsPost: builder.mutation({
      query: (data) => ({
        url: '/admin/cms/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User' as any],
    }),
    createCmsPage: builder.mutation({
      query: (data) => ({
        url: '/admin/cms/pages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User' as any],
    }),
  }),
});

export const {
  useGetCmsQuery,
  useCreateCmsPostMutation,
  useCreateCmsPageMutation,
} = cmsApi;
