import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { mockDb } from '@/services/mockDb';

const mockBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: any; params?: any },
  unknown,
  unknown
> = async (args) => {
  const { url, method = 'GET', body } = args;
  
  // Add a natural network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // 1. Auth Login
    if (url === '/auth/v1/admin/login') {
      return {
        data: {
          data: {
            accessToken: 'mock-jwt-token-foremost-trading',
            user: { id: 'u-1', email: body?.email || 'admin@example.com', fullName: 'Senior Admin' },
          },
        },
      };
    }

    // 2. Auth Get Me
    if (url === '/auth/v1/me') {
      return {
        data: {
          data: { id: 'u-1', email: 'admin@example.com', fullName: 'Senior Admin' },
        },
      };
    }

    // 3. Products
    if (url === '/admin/products') {
      if (method === 'POST') {
        const saved = mockDb.saveProduct(body);
        return { data: { data: saved } };
      }
      const list = mockDb.getProducts();
      return { data: { data: { products: list } } };
    }

    // 4. Product Shapes
    if (url.startsWith('/admin/products/') && url.endsWith('/shapes')) {
      const match = url.match(/\/admin\/products\/(.+)\/shapes/);
      const productId = match ? match[1] : '';
      if (method === 'POST') {
        const product = mockDb.getProductById(productId);
        if (product) {
          const shapes = product.shapes || [];
          const newShape = { id: `shape-${Date.now()}`, ...body };
          shapes.push(newShape);
          mockDb.updateProduct(productId, { shapes });
          return { data: { data: newShape } };
        }
        return { error: { status: 404, data: { message: 'Product not found' } } };
      }
      
      const product = mockDb.getProductById(productId);
      return { data: { data: product?.shapes || [] } };
    }

    // 5. Upload File
    if (url === '/upload/admin/upload') {
      // Mock uploading a file by returning a placeholder image or object url
      const mockFileUrl = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400';
      mockDb.saveMedia({
        name: 'uploaded_svg_layer.svg',
        size: '18 KB',
        type: 'image/svg+xml',
        url: mockFileUrl
      });
      return { data: { data: { url: mockFileUrl }, url: mockFileUrl } };
    }

    return { error: { status: 404, data: { message: `Endpoint ${url} not found` } } };
  } catch (error: any) {
    return {
      error: {
        status: 500,
        data: { message: error.message || 'Internal mock database error' },
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: mockBaseQuery,
  tagTypes: ['Product', 'User', 'Auth', 'ProductShape'],
  endpoints: () => ({}),
});

