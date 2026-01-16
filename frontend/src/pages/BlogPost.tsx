import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { publicApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { getImageUrl } from '../utils/imageUrl';
import type { BlogPost as BlogPostType } from '../types';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await publicApi.getBlogPost(slug);
        setPost(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

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
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
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
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={getImageUrl(post.imageUrl)} alt={post.title} className="w-full h-auto" />
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
