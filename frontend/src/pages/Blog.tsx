import { publicApi } from '../services/api';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

export default function Blog() {
  const { data: posts = [], isLoading: loading, isError: error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => publicApi.getBlogPosts(),
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section - Simple */}
      <section className="pt-16 pb-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
              Blog
            </h1>
            <p className="text-lg text-neutral-500">
              Stay updated with the latest news, industry insights, and tips from the Honest Label team.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">Failed to load blog posts</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No blog posts yet</h3>
              <p className="text-neutral-500">Check back soon for updates and industry insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
