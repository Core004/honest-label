import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { publicApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getImageUrl } from '../utils/imageUrl';
import OptimizedImage from '../components/OptimizedImage';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: post, isLoading: loading, isError: error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => publicApi.getBlogPost(slug!),
    enabled: !!slug,
    // Seed from cached blog posts list for instant render
    initialData: () => {
      const posts = queryClient.getQueryData<any[]>(['blogPosts']);
      return posts?.find((p) => p.slug === slug);
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon icon="lucide:file-x" className="mx-auto text-neutral-300 mb-4" width={64} />
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Post not found</h2>
          <p className="text-neutral-500 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <Icon icon="lucide:arrow-left" className="mr-2" width={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        canonical={`https://honestlabel.in/blog/${slug}`}
        ogType="article"
        ogImage={post.imageUrl ? getImageUrl(post.imageUrl) : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.imageUrl ? getImageUrl(post.imageUrl) : undefined,
          author: post.author ? { '@type': 'Person', name: post.author } : undefined,
          datePublished: post.publishedAt,
          publisher: {
            '@type': 'Organization',
            name: 'Honest Label',
            logo: { '@type': 'ImageObject', url: 'https://honestlabel.in/favicon.png' },
          },
        }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 mb-8"
        >
          <Icon icon="lucide:arrow-left" className="mr-2" width={16} />
          Back to Blog
        </Link>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            {post.author && (
              <span className="flex items-center">
                <Icon icon="lucide:user" className="mr-1" width={14} />
                {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center">
                <Icon icon="lucide:calendar" className="mr-1" width={14} />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden relative">
            <OptimizedImage src={getImageUrl(post.imageUrl)} alt={post.title} priority className="w-full h-auto" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-neutral prose-lg max-w-none">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">Share this article</span>
            <div className="flex items-center gap-4">
              <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <Icon icon="lucide:linkedin" width={20} />
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <Icon icon="lucide:twitter" width={20} />
              </button>
              <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <Icon icon="lucide:facebook" width={20} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
