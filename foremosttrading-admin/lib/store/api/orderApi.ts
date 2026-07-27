import { baseApi } from './baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({ url: '/admin/orders' }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    getProductionQueue: builder.query({
      query: () => ({ url: '/admin/production/queue' }),
      providesTags: ['Production'],
    }),
    exportProductionItem: builder.mutation({
      query: (queueId) => ({
        url: `/admin/production/${queueId}/export`,
        method: 'POST',
      }),
      invalidatesTags: ['Production'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetProductionQueueQuery,
  useExportProductionItemMutation,
} = orderApi;
