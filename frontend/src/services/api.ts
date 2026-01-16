import axios from 'axios';
import type {
  Category,
  Product,
  ProductList,
  BlogPost,
  BlogPostList,
  Inquiry,
  CreateInquiry,
  LoginResponse,
  Dashboard,
  SiteSettings,
  AdminUser,
  ClientLogo,
  Industry,
  Consumable,
  FAQ,
  TeamMember,
  Testimonial,
  HomeContent,
  QuoteRequest,
  CreateQuoteRequest,
  PageSetting,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Public API
export const publicApi = {
  // Categories
  getCategories: () => api.get<Category[]>('/categories').then((res) => res.data),
  getCategory: (slug: string) => api.get<Category>(`/categories/${slug}`).then((res) => res.data),

  // Products
  getProducts: (params?: { category?: string; search?: string; featured?: boolean }) =>
    api.get<ProductList[]>('/products', { params }).then((res) => res.data),
  getProduct: (slug: string) => api.get<Product>(`/products/${slug}`).then((res) => res.data),

  // Blog
  getBlogPosts: (page = 1, pageSize = 10) =>
    api.get<BlogPostList[]>('/blog', { params: { page, pageSize } }).then((res) => res.data),
  getBlogPost: (slug: string) => api.get<BlogPost>(`/blog/${slug}`).then((res) => res.data),

  // Inquiries
  submitInquiry: (data: CreateInquiry) => api.post<Inquiry>('/inquiries', data).then((res) => res.data),

  // Quote Requests
  submitQuoteRequest: (data: CreateQuoteRequest) => api.post<QuoteRequest>('/quoterequests', data).then((res) => res.data),

  // Settings
  getSettings: () => api.get<SiteSettings>('/settings').then((res) => res.data),

  // Client Logos
  getClientLogos: () => api.get<ClientLogo[]>('/clientlogos').then((res) => res.data),

  // Industries
  getIndustries: () => api.get<Industry[]>('/industries').then((res) => res.data),
  getIndustry: (slug: string) => api.get<Industry>(`/industries/${slug}`).then((res) => res.data),

  // Consumables
  getConsumables: () => api.get<Consumable[]>('/consumables').then((res) => res.data),
  getConsumable: (slug: string) => api.get<Consumable>(`/consumables/${slug}`).then((res) => res.data),

  // FAQs
  getFAQs: () => api.get<FAQ[]>('/faqs').then((res) => res.data),
  getFAQsByCategory: (category: string) => api.get<FAQ[]>(`/faqs/category/${category}`).then((res) => res.data),

  // Team Members
  getTeamMembers: () => api.get<TeamMember[]>('/teammembers').then((res) => res.data),

  // Testimonials
  getTestimonials: () => api.get<Testimonial[]>('/testimonials').then((res) => res.data),

  // Home Content
  getHomeContent: () => api.get<HomeContent[]>('/homecontent').then((res) => res.data),
  getHomeContentBySection: (section: string) => api.get<HomeContent[]>(`/homecontent/section/${section}`).then((res) => res.data),

  // Page Settings (for navbar)
  getPageSettings: () => api.get<PageSetting[]>('/pagesettings').then((res) => res.data),
  checkPagePublished: (slug: string) => api.get<boolean>(`/pagesettings/check/${slug}`).then((res) => res.data),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then((res) => res.data),
  getCurrentUser: () => api.get<AdminUser>('/auth/me').then((res) => res.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Admin API
export const adminApi = {
  // Dashboard
  getDashboard: () => api.get<Dashboard>('/admin/dashboard').then((res) => res.data),

  // Categories
  getAllCategories: () => api.get<Category[]>('/categories/admin').then((res) => res.data),
  createCategory: (data: { name: string; description?: string; icon?: string }) =>
    api.post<Category>('/categories', data).then((res) => res.data),
  updateCategory: (id: number, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) =>
    api.put(`/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),

  // Products
  getAllProducts: () => api.get<Product[]>('/products/admin').then((res) => res.data),
  createProduct: (data: {
    name: string;
    description?: string;
    shortDescription?: string;
    imageUrl?: string;
    features?: string;
    isFeatured: boolean;
    categoryId: number;
  }) => api.post<Product>('/products', data).then((res) => res.data),
  updateProduct: (
    id: number,
    data: {
      name?: string;
      description?: string;
      shortDescription?: string;
      imageUrl?: string;
      features?: string;
      isFeatured?: boolean;
      isActive?: boolean;
      categoryId?: number;
      displayOrder?: number;
    }
  ) => api.put(`/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),

  // Blog
  getAllBlogPosts: () => api.get<BlogPost[]>('/blog/admin').then((res) => res.data),
  createBlogPost: (data: {
    title: string;
    excerpt?: string;
    content?: string;
    imageUrl?: string;
    author?: string;
    isPublished: boolean;
  }) => api.post<BlogPost>('/blog', data).then((res) => res.data),
  updateBlogPost: (
    id: number,
    data: {
      title?: string;
      excerpt?: string;
      content?: string;
      imageUrl?: string;
      author?: string;
      isPublished?: boolean;
    }
  ) => api.put(`/blog/${id}`, data),
  deleteBlogPost: (id: number) => api.delete(`/blog/${id}`),

  // Inquiries
  getInquiries: (params?: { status?: number; page?: number; pageSize?: number }) =>
    api.get<Inquiry[]>('/inquiries', { params }).then((res) => res.data),
  getInquiry: (id: number) => api.get<Inquiry>(`/inquiries/${id}`).then((res) => res.data),
  updateInquiry: (id: number, data: { status?: number; adminNotes?: string }) =>
    api.put(`/inquiries/${id}`, data),
  deleteInquiry: (id: number) => api.delete(`/inquiries/${id}`),

  // Settings
  updateSettings: (settings: SiteSettings) => api.put('/settings', settings),

  // Client Logos
  getAllClientLogos: () => api.get<ClientLogo[]>('/clientlogos/admin').then((res) => res.data),
  createClientLogo: (data: Partial<ClientLogo>) => api.post<ClientLogo>('/clientlogos', data).then((res) => res.data),
  updateClientLogo: (id: number, data: Partial<ClientLogo>) => api.put(`/clientlogos/${id}`, data),
  deleteClientLogo: (id: number) => api.delete(`/clientlogos/${id}`),

  // Industries
  getAllIndustries: () => api.get<Industry[]>('/industries/admin').then((res) => res.data),
  createIndustry: (data: Partial<Industry>) => api.post<Industry>('/industries', data).then((res) => res.data),
  updateIndustry: (id: number, data: Partial<Industry>) => api.put(`/industries/${id}`, data),
  deleteIndustry: (id: number) => api.delete(`/industries/${id}`),

  // Consumables
  getAllConsumables: () => api.get<Consumable[]>('/consumables/admin').then((res) => res.data),
  createConsumable: (data: Partial<Consumable>) => api.post<Consumable>('/consumables', data).then((res) => res.data),
  updateConsumable: (id: number, data: Partial<Consumable>) => api.put(`/consumables/${id}`, data),
  deleteConsumable: (id: number) => api.delete(`/consumables/${id}`),

  // FAQs
  getAllFAQs: () => api.get<FAQ[]>('/faqs/admin').then((res) => res.data),
  createFAQ: (data: Partial<FAQ>) => api.post<FAQ>('/faqs', data).then((res) => res.data),
  updateFAQ: (id: number, data: Partial<FAQ>) => api.put(`/faqs/${id}`, data),
  deleteFAQ: (id: number) => api.delete(`/faqs/${id}`),

  // Team Members
  getAllTeamMembers: () => api.get<TeamMember[]>('/teammembers/admin').then((res) => res.data),
  createTeamMember: (data: Partial<TeamMember>) => api.post<TeamMember>('/teammembers', data).then((res) => res.data),
  updateTeamMember: (id: number, data: Partial<TeamMember>) => api.put(`/teammembers/${id}`, data),
  deleteTeamMember: (id: number) => api.delete(`/teammembers/${id}`),

  // Testimonials
  getAllTestimonials: () => api.get<Testimonial[]>('/testimonials/admin').then((res) => res.data),
  createTestimonial: (data: Partial<Testimonial>) => api.post<Testimonial>('/testimonials', data).then((res) => res.data),
  updateTestimonial: (id: number, data: Partial<Testimonial>) => api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: number) => api.delete(`/testimonials/${id}`),

  // Home Content
  getAllHomeContent: () => api.get<HomeContent[]>('/homecontent').then((res) => res.data),
  createHomeContent: (data: Partial<HomeContent>) => api.post<HomeContent>('/homecontent', data).then((res) => res.data),
  updateHomeContent: (id: number, data: Partial<HomeContent>) => api.put(`/homecontent/${id}`, data),
  upsertHomeContent: (data: Partial<HomeContent>) => api.put('/homecontent/upsert', data),
  deleteHomeContent: (id: number) => api.delete(`/homecontent/${id}`),

  // Page Settings
  getAllPageSettings: () => api.get<PageSetting[]>('/pagesettings/all').then((res) => res.data),
  updatePageSetting: (id: number, data: Partial<PageSetting>) => api.put(`/pagesettings/${id}`, data),
  togglePageSetting: (id: number) => api.put(`/pagesettings/${id}/toggle`),
};

export default api;
