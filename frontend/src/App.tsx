import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';

// Lazy-loaded public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Clients = lazy(() => import('./pages/Clients'));
const Consumables = lazy(() => import('./pages/Consumables'));
const Industries = lazy(() => import('./pages/Industries'));
const GetQuote = lazy(() => import('./pages/GetQuote'));

// Lazy-loaded admin pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/AdminProducts'));
const AdminCategories = lazy(() => import('./admin/AdminCategories'));
const AdminBlog = lazy(() => import('./admin/AdminBlog'));
const AdminInquiries = lazy(() => import('./admin/AdminInquiries'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const AdminClients = lazy(() => import('./admin/AdminClients'));
const AdminIndustries = lazy(() => import('./admin/AdminIndustries'));
const AdminConsumables = lazy(() => import('./admin/AdminConsumables'));
const AdminFAQs = lazy(() => import('./admin/AdminFAQs'));
const AdminTeam = lazy(() => import('./admin/AdminTeam'));
const AdminTestimonials = lazy(() => import('./admin/AdminTestimonials'));
const AdminHomeContent = lazy(() => import('./admin/AdminHomeContent'));
const AdminPages = lazy(() => import('./admin/AdminPages'));
const AdminQuoteRequests = lazy(() => import('./admin/AdminQuoteRequests'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch if data is fresh
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:slug" element={<ProductDetail />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="contact" element={<Contact />} />
                <Route path="clients" element={<Clients />} />
                <Route path="consumables" element={<Consumables />} />
                <Route path="industries" element={<Industries />} />
                <Route path="get-quote" element={<GetQuote />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="industries" element={<AdminIndustries />} />
                <Route path="consumables" element={<AdminConsumables />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="faqs" element={<AdminFAQs />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="home-content" element={<AdminHomeContent />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="quote-requests" element={<AdminQuoteRequests />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
