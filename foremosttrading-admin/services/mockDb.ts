"use client";

// Mock Database Service for ForemostTrading Admin Dashboard
// Provides persistent CRUD access via localStorage

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  description: string;
  images: string[];
  isCustomizable: boolean;
  isActive: boolean;
  createdAt: string;
  shapes?: any[];
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface MockTemplate {
  id: string;
  name: string;
  category: string;
  svgUrl: string;
  layersCount: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    customized: boolean;
    previewUrl?: string;
    specifications?: any;
  }>;
  total: number;
  status: "Pending" | "Processing" | "Printing" | "Shipping" | "Completed";
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  savedDesigns: any[];
  addresses: any[];
}

const DEFAULT_PRODUCTS: MockProduct[] = [
  {
    id: "prod-1",
    name: "Evolution Football Jersey",
    slug: "evolution-football-jersey",
    category: "FOOTBALL",
    basePrice: 199.99,
    description: "Premium customizable high-performance football jersey designed for elite clubs. Includes ventilated side panels and moisture-wicking technology.",
    images: ["https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=500"],
    isCustomizable: true,
    isActive: true,
    createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "Aero Basketball Shorts",
    slug: "aero-basketball-shorts",
    category: "BASKETBALL",
    basePrice: 89.99,
    description: "Breathable lightweight mesh basketball shorts with elastic drawcord waistband. Tailored for comfort and explosive agility.",
    images: ["https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=500"],
    isCustomizable: false,
    isActive: true,
    createdAt: "2026-07-03T14:30:00Z",
  },
  {
    id: "prod-3",
    name: "Classic Tennis Polo",
    slug: "classic-tennis-polo",
    category: "TENNIS",
    basePrice: 110.00,
    description: "Classic fit tennis polo shirt. UV protection and sweat-wicking knit material ensure you stay dry on court.",
    images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500"],
    isCustomizable: true,
    isActive: true,
    createdAt: "2026-07-05T09:15:00Z",
  },
  {
    id: "prod-4",
    name: "Voltaic Running Compression Shirt",
    slug: "voltaic-running-compression-shirt",
    category: "ACCESSORIES",
    basePrice: 75.00,
    description: "Form-fitting compression top providing target muscle support. Engineered seams limit chafing during runs.",
    images: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500"],
    isCustomizable: true,
    isActive: false,
    createdAt: "2026-07-10T16:45:00Z",
  }
];

const DEFAULT_CATEGORIES: MockCategory[] = [
  { id: "cat-1", name: "Football", slug: "football", description: "Team jerseys, socks, guards, and fully customizable kits.", productCount: 15 },
  { id: "cat-2", name: "Basketball", slug: "basketball", description: "Jerseys, lightweight shorts, shootarounds, and mesh bibs.", productCount: 12 },
  { id: "cat-3", name: "Tennis", slug: "tennis", description: "Breathable tennis shirts, skirts, wristbands, and visors.", productCount: 8 },
  { id: "cat-4", name: "Accessories", slug: "accessories", description: "Compression gear, socks, bags, and general athletic gear.", productCount: 22 },
];

const DEFAULT_TEMPLATES: MockTemplate[] = [
  { id: "temp-1", name: "Classic Striped Jersey Template", category: "FOOTBALL", svgUrl: "/templates/striped-jersey.svg", layersCount: 6 },
  { id: "temp-2", name: "V-Neck Solid Top Template", category: "FOOTBALL", svgUrl: "/templates/vneck-jersey.svg", layersCount: 4 },
  { id: "temp-3", name: "Retro Basketball Jersey", category: "BASKETBALL", svgUrl: "/templates/retro-hoops.svg", layersCount: 5 },
  { id: "temp-4", name: "Pique Collar Polo Layout", category: "TENNIS", svgUrl: "/templates/polo.svg", layersCount: 3 },
];

const DEFAULT_ORDERS: MockOrder[] = [
  {
    id: "ord-1",
    orderNumber: "FT-2026-0001",
    customerName: "Alex Mercer",
    customerEmail: "alex@mercer.com",
    items: [
      {
        productId: "prod-1",
        productName: "Evolution Football Jersey",
        quantity: 15,
        price: 199.99,
        customized: true,
        previewUrl: "https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=100",
        specifications: {
          teamName: "Strikers FC",
          primaryColor: "#FF3B30",
          secondaryColor: "#000000",
          roster: [
            { name: "Mercer", number: "10", size: "L" },
            { name: "Hale", number: "7", size: "M" },
            { name: "Stone", number: "4", size: "XL" }
          ]
        }
      }
    ],
    total: 2999.85,
    status: "Processing",
    paymentStatus: "Paid",
    createdAt: "2026-07-18T10:00:00Z",
    shippingAddress: {
      street: "123 Stadium Way",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA"
    }
  },
  {
    id: "ord-2",
    orderNumber: "FT-2026-0002",
    customerName: "Sarah Connor",
    customerEmail: "sarah.c@tech.org",
    items: [
      {
        productId: "prod-2",
        productName: "Aero Basketball Shorts",
        quantity: 2,
        price: 89.99,
        customized: false,
      }
    ],
    total: 179.98,
    status: "Pending",
    paymentStatus: "Unpaid",
    createdAt: "2026-07-19T06:12:00Z",
    shippingAddress: {
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      country: "USA"
    }
  },
  {
    id: "ord-3",
    orderNumber: "FT-2026-0003",
    customerName: "Bruce Wayne",
    customerEmail: "bruce@waynecorp.com",
    items: [
      {
        productId: "prod-1",
        productName: "Evolution Football Jersey",
        quantity: 30,
        price: 199.99,
        customized: true,
        specifications: {
          teamName: "Gotham Knights",
          primaryColor: "#000000",
          secondaryColor: "#FFCC00",
          roster: [{ name: "Wayne", number: "1", size: "XL" }]
        }
      }
    ],
    total: 5999.70,
    status: "Printing",
    paymentStatus: "Paid",
    createdAt: "2026-07-17T11:40:00Z",
    shippingAddress: {
      street: "1007 Mountain Drive",
      city: "Gotham",
      state: "NJ",
      zip: "07001",
      country: "USA"
    }
  },
  {
    id: "ord-4",
    orderNumber: "FT-2026-0004",
    customerName: "Peter Parker",
    customerEmail: "peter@dailybugle.net",
    items: [
      {
        productId: "prod-3",
        productName: "Classic Tennis Polo",
        quantity: 1,
        price: 110.00,
        customized: false,
      }
    ],
    total: 110.00,
    status: "Completed",
    paymentStatus: "Paid",
    createdAt: "2026-07-12T15:20:00Z",
    shippingAddress: {
      street: "20 Ingram Street",
      city: "Forest Hills",
      state: "NY",
      zip: "11375",
      country: "USA"
    }
  }
];

const DEFAULT_CUSTOMERS: MockCustomer[] = [
  {
    id: "cust-1",
    name: "Alex Mercer",
    email: "alex@mercer.com",
    ordersCount: 4,
    totalSpent: 4200.50,
    savedDesigns: [
      { name: "Strikers FC Home Jersey", category: "Football", lastUpdated: "2026-07-18" },
      { name: "Strikers Away Alternate", category: "Football", lastUpdated: "2026-07-15" }
    ],
    addresses: [
      { label: "Billing", street: "123 Stadium Way", city: "Austin", state: "TX", zip: "78701", country: "USA" }
    ]
  },
  {
    id: "cust-2",
    name: "Sarah Connor",
    email: "sarah.c@tech.org",
    ordersCount: 1,
    totalSpent: 179.98,
    savedDesigns: [],
    addresses: [
      { label: "Home", street: "742 Evergreen Terrace", city: "Springfield", state: "IL", zip: "62704", country: "USA" }
    ]
  },
  {
    id: "cust-3",
    name: "Bruce Wayne",
    email: "bruce@waynecorp.com",
    ordersCount: 12,
    totalSpent: 84300.00,
    savedDesigns: [
      { name: "Gotham Bats Kit", category: "Football", lastUpdated: "2026-07-17" },
      { name: "Wayne Manor Polo", category: "Tennis", lastUpdated: "2026-07-10" }
    ],
    addresses: [
      { label: "Penthouse", street: "1007 Mountain Drive", city: "Gotham", state: "NJ", zip: "07001", country: "USA" }
    ]
  },
  {
    id: "cust-4",
    name: "Peter Parker",
    email: "peter@dailybugle.net",
    ordersCount: 2,
    totalSpent: 220.00,
    savedDesigns: [],
    addresses: [
      { label: "Apartment", street: "20 Ingram Street", city: "Forest Hills", state: "NY", zip: "11375", country: "USA" }
    ]
  }
];

const DEFAULT_COUPONS = [
  { id: "coup-1", code: "WELCOME10", discountType: "percentage", discountValue: 10, isActive: true, usageCount: 142, expiryDate: "2027-01-01" },
  { id: "coup-2", code: "TEAMPOWER200", discountType: "fixed", discountValue: 200, isActive: true, usageCount: 24, expiryDate: "2026-12-31" },
  { id: "coup-3", code: "SUMMERCOLLAR", discountType: "percentage", discountValue: 15, isActive: false, usageCount: 89, expiryDate: "2026-06-30" },
];

const DEFAULT_CMS = {
  posts: [
    { id: "post-1", title: "Custom Jerseys: 2026 Design Trends", author: "L. Stone", status: "Published", views: 1250, date: "2026-07-10" },
    { id: "post-2", title: "Selecting the Perfect Fit for Your Team", author: "M. Mercer", status: "Draft", views: 0, date: "2026-07-19" },
    { id: "post-3", title: "Why Print-on-Demand is Revolutionizing Leagues", author: "Admin", status: "Published", views: 680, date: "2026-06-28" }
  ],
  pages: [
    { id: "page-1", title: "About ForemostTrading", slug: "about", status: "Active", lastModified: "2026-05-12" },
    { id: "page-2", title: "Customization Guidelines", slug: "customization-rules", status: "Active", lastModified: "2026-07-02" },
    { id: "page-3", title: "Sizing Charts & Guide", slug: "size-chart", status: "Active", lastModified: "2026-06-15" }
  ]
};

const DEFAULT_MEDIA = [
  { id: "m-1", name: "football-jersey-blank.png", type: "image/png", size: "128 KB", url: "https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=200" },
  { id: "m-2", name: "team-logo-sample.svg", type: "image/svg+xml", size: "24 KB", url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200" },
  { id: "m-3", name: "stripes-pattern.png", type: "image/png", size: "45 KB", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200" },
  { id: "m-4", name: "polo-collar-detail.jpg", type: "image/jpeg", size: "310 KB", url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200" },
];

export const mockDb = {
  initialize: () => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("ft_db_seeded")) {
      localStorage.setItem("ft_products", JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem("ft_categories", JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem("ft_templates", JSON.stringify(DEFAULT_TEMPLATES));
      localStorage.setItem("ft_orders", JSON.stringify(DEFAULT_ORDERS));
      localStorage.setItem("ft_customers", JSON.stringify(DEFAULT_CUSTOMERS));
      localStorage.setItem("ft_coupons", JSON.stringify(DEFAULT_COUPONS));
      localStorage.setItem("ft_cms", JSON.stringify(DEFAULT_CMS));
      localStorage.setItem("ft_media", JSON.stringify(DEFAULT_MEDIA));
      localStorage.setItem("ft_db_seeded", "true");
    }
  },

  // Products
  getProducts: (): MockProduct[] => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_PRODUCTS;
    return JSON.parse(localStorage.getItem("ft_products") || "[]");
  },
  getProductById: (id: string): MockProduct | undefined => {
    return mockDb.getProducts().find((p) => p.id === id);
  },
  saveProduct: (product: Omit<MockProduct, "id" | "createdAt">): MockProduct => {
    const products = mockDb.getProducts();
    const newProduct: MockProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_products", JSON.stringify(products));
    }
    return newProduct;
  },
  updateProduct: (id: string, updates: Partial<MockProduct>): MockProduct => {
    const products = mockDb.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    const updated = { ...products[idx], ...updates };
    products[idx] = updated;
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_products", JSON.stringify(products));
    }
    return updated;
  },
  deleteProduct: (id: string): boolean => {
    const products = mockDb.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_products", JSON.stringify(filtered));
    }
    return products.length !== filtered.length;
  },

  // Categories
  getCategories: (): MockCategory[] => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_CATEGORIES;
    return JSON.parse(localStorage.getItem("ft_categories") || "[]");
  },
  saveCategory: (category: Omit<MockCategory, "id" | "productCount">): MockCategory => {
    const categories = mockDb.getCategories();
    const newCat: MockCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    categories.push(newCat);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_categories", JSON.stringify(categories));
    }
    return newCat;
  },
  deleteCategory: (id: string): boolean => {
    const categories = mockDb.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_categories", JSON.stringify(filtered));
    }
    return categories.length !== filtered.length;
  },

  // Templates
  getTemplates: (): MockTemplate[] => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_TEMPLATES;
    return JSON.parse(localStorage.getItem("ft_templates") || "[]");
  },
  saveTemplate: (template: Omit<MockTemplate, "id">): MockTemplate => {
    const templates = mockDb.getTemplates();
    const newTemp: MockTemplate = {
      ...template,
      id: `temp-${Date.now()}`,
    };
    templates.push(newTemp);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_templates", JSON.stringify(templates));
    }
    return newTemp;
  },
  deleteTemplate: (id: string): boolean => {
    const templates = mockDb.getTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_templates", JSON.stringify(filtered));
    }
    return templates.length !== filtered.length;
  },

  // Orders
  getOrders: (): MockOrder[] => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_ORDERS;
    return JSON.parse(localStorage.getItem("ft_orders") || "[]");
  },
  getOrderById: (id: string): MockOrder | undefined => {
    return mockDb.getOrders().find((o) => o.id === id);
  },
  updateOrderStatus: (id: string, status: MockOrder["status"]): MockOrder => {
    const orders = mockDb.getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    orders[idx].status = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_orders", JSON.stringify(orders));
    }
    return orders[idx];
  },

  // Customers
  getCustomers: (): MockCustomer[] => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_CUSTOMERS;
    return JSON.parse(localStorage.getItem("ft_customers") || "[]");
  },

  // Coupons
  getCoupons: () => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_COUPONS;
    return JSON.parse(localStorage.getItem("ft_coupons") || "[]");
  },
  saveCoupon: (coupon: any) => {
    const coupons = mockDb.getCoupons();
    const newCoup = { ...coupon, id: `coup-${Date.now()}`, usageCount: 0 };
    coupons.push(newCoup);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_coupons", JSON.stringify(coupons));
    }
    return newCoup;
  },
  deleteCoupon: (id: string) => {
    const coupons = mockDb.getCoupons();
    const filtered = coupons.filter((c: any) => c.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_coupons", JSON.stringify(filtered));
    }
    return coupons.length !== filtered.length;
  },

  // CMS
  getCms: () => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_CMS;
    return JSON.parse(localStorage.getItem("ft_cms") || "{}");
  },
  saveCmsPost: (post: any) => {
    const cms = mockDb.getCms();
    const newPost = { ...post, id: `post-${Date.now()}`, views: 0, date: new Date().toISOString().split('T')[0] };
    cms.posts.push(newPost);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_cms", JSON.stringify(cms));
    }
    return newPost;
  },
  saveCmsPage: (page: any) => {
    const cms = mockDb.getCms();
    const newPage = { ...page, id: `page-${Date.now()}`, lastModified: new Date().toISOString().split('T')[0] };
    cms.pages.push(newPage);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_cms", JSON.stringify(cms));
    }
    return newPage;
  },

  // Media
  getMedia: () => {
    mockDb.initialize();
    if (typeof window === "undefined") return DEFAULT_MEDIA;
    return JSON.parse(localStorage.getItem("ft_media") || "[]");
  },
  saveMedia: (file: { name: string; size: string; url: string; type: string }) => {
    const media = mockDb.getMedia();
    const newMedia = { ...file, id: `m-${Date.now()}` };
    media.push(newMedia);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_media", JSON.stringify(media));
    }
    return newMedia;
  }
};
