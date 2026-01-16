import { Link } from 'react-router-dom';
import type { BlogPostList } from '../types';
import { getImageUrl } from '../utils/imageUrl';

interface BlogCardProps {
  post: BlogPostList;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/blog/${post.slug}`}>
      <article className="group rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-neutral-200 hover:shadow-neutral-200/50">
        {post.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={getImageUrl(post.imageUrl)}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
            {post.author && <span>{post.author}</span>}
            {post.author && post.publishedAt && <span>•</span>}
            {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
