import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Clients from './pages/Clients';
import Consumables from './pages/Consumables';
import Industries from './pages/Industries';
import GetQuote from './pages/GetQuote';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminBlog from './admin/AdminBlog';
import AdminInquiries from './admin/AdminInquiries';
import AdminSettings from './admin/AdminSettings';
import AdminClients from './admin/AdminClients';
import AdminIndustries from './admin/AdminIndustries';
import AdminConsumables from './admin/AdminConsumables';
import AdminFAQs from './admin/AdminFAQs';
import AdminTeam from './admin/AdminTeam';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminHomeContent from './admin/AdminHomeContent';
import AdminPages from './admin/AdminPages';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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
              <Route path="pages" element={<AdminPages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
