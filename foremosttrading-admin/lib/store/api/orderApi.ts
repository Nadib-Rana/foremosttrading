import { baseApi } from './baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({ url: '/admin/orders' }),
      providesTags: ['Order' as any],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order' as any],
    }),
    getProductionQueue: builder.query({
      query: () => ({ url: '/admin/production/queue' }),
      providesTags: ['Production' as any],
    }),
    exportProductionItem: builder.mutation({
      query: (queueId) => ({
        url: `/admin/production/${queueId}/export`,
        method: 'POST',
      }),
      invalidatesTags: ['Production' as any],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetProductionQueueQuery,
  useExportProductionItemMutation,
} = orderApi;
