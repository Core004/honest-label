import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../services/api';

import type { PageSetting } from '../types';

const defaultNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/consumables', label: 'Consumables' },
  { href: '/industries', label: 'Industries' },
  { href: '/clients', label: 'Clients' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { data: pages } = useQuery({
    queryKey: ['pageSettings'],
    queryFn: publicApi.getPageSettings,
  });

  // Derive nav links from page settings (or use defaults)
  let navLinks = defaultNavLinks;
  let showGetQuote = true;

  if (pages && pages.length > 0) {
    const publishedPages = pages.filter((p: PageSetting) => p.isPublished && p.showInNavbar);
    const dynamicLinks = publishedPages
      .filter((p: PageSetting) => p.pageSlug !== 'get-quote')
      .sort((a: PageSetting, b: PageSetting) => a.displayOrder - b.displayOrder)
      .map((p: PageSetting) => ({
        href: `/${p.pageSlug}`,
        label: p.pageName
      }));

    if (dynamicLinks.length > 0) {
      navLinks = [{ href: '/', label: 'Home' }, ...dynamicLinks];
    }

    const getQuotePage = pages.find((p: PageSetting) => p.pageSlug === 'get-quote');
    showGetQuote = !getQuotePage || (getQuotePage.isPublished && getQuotePage.showInNavbar);
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex-shrink-0 flex items-center">
            <img src="/logo.svg" alt="Honest Label" className="h-10 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={link.href === '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {showGetQuote && (
              <Link
                to="/get-quote"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-all shadow-sm text-white bg-neutral-900 hover:bg-neutral-800"
              >
                Get a Quote
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-500 focus:outline-none p-2 hover:text-neutral-900"
            >
              <Icon icon={isMenuOpen ? 'lucide:x' : 'lucide:menu'} width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => { setIsMenuOpen(false); if (link.href === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-sm font-medium px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? 'text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {showGetQuote && (
                <Link
                  to="/get-quote"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800"
                >
                  Get a Quote
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
