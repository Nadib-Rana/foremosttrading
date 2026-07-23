import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({ url: '/admin/products' }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    addProduct: builder.mutation({
      query: (productData) => ({
        url: '/admin/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Product', { type: 'Product', id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
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
      query: (productId) => ({ url: `/admin/products/${productId}/shapes` }),
      providesTags: ['ProductShape'],
    }),
    updateLayerMapping: builder.mutation({
      query: ({ productId, mappingId, data }) => ({
        url: `/admin/products/${productId}/mappings/${mappingId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const { 
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductShapeMutation,
  useGetProductShapesQuery,
  useUpdateLayerMappingMutation,
} = productApi;
