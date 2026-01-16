import { useEffect, useRef, useState, useMemo } from 'react';
import { publicApi } from '../services/api';
import type { Consumable } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

export function LabelAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [consumables, setConsumables] = useState<Consumable[]>([]);

  // Generate stable random positions once
  const floatingPositions = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => ({
      left: `${(index % 4) * 22 + 5 + Math.floor(Math.random() * 10)}%`,
      top: `${Math.floor(index / 4) * 45 + 5 + Math.floor(Math.random() * 15)}%`,
      rotate: `rotate(${-10 + Math.floor(Math.random() * 20)}deg)`,
    }));
  }, []);

  useEffect(() => {
    const fetchConsumables = async () => {
      try {
        const data = await publicApi.getConsumables();
        setConsumables(data);
      } catch (error) {
        console.error('Failed to fetch consumables:', error);
      }
    };
    fetchConsumables();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const labels = container.querySelectorAll('.floating-label');

    labels.forEach((label, index) => {
      const el = label as HTMLElement;
      const delay = index * 0.5;
      const duration = 15 + Math.random() * 10;

      el.style.animationDelay = `${delay}s`;
      el.style.animationDuration = `${duration}s`;
    });
  }, [consumables]);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e5e5e5 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating Labels Container */}
      <div ref={containerRef} className="relative h-[350px] sm:h-[400px] md:h-[500px] max-w-7xl mx-auto px-4">
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-neutral-200 mx-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 mb-2 sm:mb-4">
              Labels That Define
              <span className="block text-red-500">Your Brand</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-md">
              From barcodes to security seals, we manufacture labels that work as hard as you do.
            </p>
          </div>
        </div>

        {/* Floating Labels - Using consumables from database */}
        {consumables.slice(0, 8).map((item, index) => (
          <div
            key={item.id}
            className={`floating-label absolute w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-lg sm:rounded-xl shadow-lg bg-white p-1 sm:p-2 border border-neutral-100 opacity-80 hover:opacity-100 transition-opacity`}
            style={{
              left: floatingPositions[index]?.left || `${index * 12}%`,
              top: floatingPositions[index]?.top || `${index * 10}%`,
              transform: floatingPositions[index]?.rotate || 'rotate(0deg)',
            }}
          >
            <img
              src={getImageUrl(item.imageUrl)}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Animated Conveyor Belt */}
      <div className="relative mt-8 sm:mt-12 overflow-hidden">
        <div className="flex animate-scroll">
          {consumables.length > 0 && [...consumables, ...consumables].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-28 sm:w-32 md:w-36 mx-2 sm:mx-4 flex flex-col items-center transform hover:scale-105 transition-transform"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-lg shadow-md p-2 sm:p-3 border border-neutral-100">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-neutral-700 text-center line-clamp-2 w-full">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-red-200 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-red-300 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute top-1/2 left-5 w-3 h-3 bg-red-400 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-red-500 rounded-full animate-bounce delay-300"></div>
    </section>
  );
}
