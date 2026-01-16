export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  features?: string;
  isFeatured: boolean;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
}

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  imageUrl?: string;
  isFeatured: boolean;
  categoryName?: string;
  categorySlug?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface BlogPostList {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
}

export type InquiryStatus = 0 | 1 | 2 | 3;

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  labelType?: string;
  message?: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface CreateInquiry {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  labelType?: string;
  message?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: AdminUser;
}

export interface Dashboard {
  totalProducts: number;
  totalCategories: number;
  totalBlogPosts: number;
  totalInquiries: number;
  newInquiries: number;
  recentInquiries: Inquiry[];
}

export interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  business_hours?: string;
  facebook_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  [key: string]: string | undefined;
}

export interface ClientLogo {
  id: number;
  name: string;
  imageUrl?: string;
  website?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Industry {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Consumable {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  features?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  company: string;
  content: string;
  imageUrl?: string;
  rating: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface HomeContent {
  id: number;
  section: string;
  key: string;
  value?: string;
  imageUrl?: string;
  updatedAt: string;
}

export type QuoteRequestStatus = 0 | 1 | 2 | 3 | 4;

export interface QuoteRequest {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productType: string;
  size?: string;
  quantity?: string;
  material?: string;
  printType?: string;
  additionalDetails?: string;
  status: QuoteRequestStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface CreateQuoteRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productType: string;
  size?: string;
  quantity?: string;
  material?: string;
  printType?: string;
  additionalDetails?: string;
}

export interface PageSetting {
  id: number;
  pageName: string;
  pageSlug: string;
  pageTitle: string;
  isPublished: boolean;
  showInNavbar: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
