import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { publicApi } from '../services/api';

/**
 * Loads static JSON snapshots instantly, then seeds React Query cache.
 * Pages render immediately with pre-baked data. React Query revalidates
 * from the real API in the background after staleTime expires.
 */

interface SnapshotConfig {
  queryKey: unknown[];
  file: string;
  apiFn: () => Promise<unknown>;
}

const snapshots: SnapshotConfig[] = [
  { queryKey: ['products', { featured: true }], file: 'products-featured.json', apiFn: () => publicApi.getProducts({ featured: true }) },
  { queryKey: ['products', {}], file: 'products.json', apiFn: () => publicApi.getProducts() },
  { queryKey: ['categories'], file: 'categories.json', apiFn: publicApi.getCategories },
  { queryKey: ['consumables'], file: 'consumables.json', apiFn: publicApi.getConsumables },
  { queryKey: ['industries'], file: 'industries.json', apiFn: publicApi.getIndustries },
  { queryKey: ['clientLogos'], file: 'clientlogos.json', apiFn: publicApi.getClientLogos },
  { queryKey: ['testimonials'], file: 'testimonials.json', apiFn: publicApi.getTestimonials },
  { queryKey: ['faqs'], file: 'faqs.json', apiFn: publicApi.getFAQs },
  { queryKey: ['pageSettings'], file: 'pagesettings.json', apiFn: publicApi.getPageSettings },
  { queryKey: ['blogPosts'], file: 'blogposts.json', apiFn: () => publicApi.getBlogPosts() },
];

export function usePrefetchData() {
  const queryClient = useQueryClient();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // Load all static snapshots in parallel (instant - same origin, <1ms each)
    snapshots.forEach(async ({ queryKey, file, apiFn }) => {
      try {
        const res = await fetch(`/data/${file}`);
        if (res.ok) {
          const data = await res.json();
          // Seed cache with static data - pages render instantly
          queryClient.setQueryData(queryKey, data);
        }
      } catch {
        // Static file missing - fall back to API prefetch
        queryClient.prefetchQuery({ queryKey, queryFn: apiFn });
      }
    });
  }, [queryClient]);
}
