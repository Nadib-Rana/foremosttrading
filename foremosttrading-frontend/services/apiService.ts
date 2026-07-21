/**
 * Customer Frontend API Service
 * Handles base fetch wrapper, JWT tokens in localStorage, and standardized response envelopes.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export async function fetchApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ft_auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('ft_auth_token');
    localStorage.removeItem('ft_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const envelope = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(envelope.message || 'API request failed');
  }

  // Return the unwrapped data payload matching standardized NestJS envelopes
  return envelope.data !== undefined ? envelope.data : envelope;
}

export const api = {
  // Auth
  register: (body: any) => fetchApi('/auth/v1/register', { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp: (body: any) => fetchApi('/auth/v1/verify-email', { method: 'POST', body: JSON.stringify(body) }),
  setupProfile: (body: any) => fetchApi('/auth/v1/setup-profile', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => fetchApi('/auth/v1/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => fetchApi('/auth/v1/me'),

  // Catalog
  getCategories: () => fetchApi('/categories'),
  getProducts: () => fetchApi('/products'),
  getProductBySlug: (slug: string) => fetchApi(`/products/${slug}`),
  getProductConfigSchema: (idOrSlug: string) => fetchApi(`/products/${idOrSlug}/config-schema`),

  // Cart
  getCart: () => fetchApi('/cart'),
  addToCart: (body: any) => fetchApi('/cart/items', { method: 'POST', body: JSON.stringify(body) }),
  updateCartItem: (itemId: string, body: any) => fetchApi(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCartItem: (itemId: string) => fetchApi(`/cart/items/${itemId}`, { method: 'DELETE' }),

  // Checkout
  validateCoupon: (body: any) => fetchApi('/checkout/coupons/validate', { method: 'POST', body: JSON.stringify(body) }),
  getCheckoutSummary: (body: any) => fetchApi('/checkout/summary', { method: 'POST', body: JSON.stringify(body) }),
  getAddresses: () => fetchApi('/checkout/addresses'),
  createAddress: (body: any) => fetchApi('/checkout/addresses', { method: 'POST', body: JSON.stringify(body) }),
  deleteAddress: (id: string) => fetchApi(`/checkout/addresses/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (body: any) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => fetchApi('/orders'),
  getOrderById: (id: string) => fetchApi(`/orders/${id}`),
  payOrder: (id: string) => fetchApi(`/orders/${id}/pay`, { method: 'POST' }),
};
