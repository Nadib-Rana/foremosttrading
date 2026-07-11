import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (productData) => ({
        url: '/admin/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    addProductShape: builder.mutation({
      query: ({ productId, shapeData }) => ({
        url: `/admin/products/${productId}/shapes`,
        method: 'POST',
        body: shapeData,
      }),
      invalidatesTags: ['ProductShape'],
    }),
    getProductShapes: builder.query({
      query: (productId) => `/admin/products/${productId}/shapes`,
      providesTags: ['ProductShape'],
    }),
  }),
});

export const { 
  useAddProductMutation,
  useAddProductShapeMutation,
  useGetProductShapesQuery
} = productApi;
