import { InfiniteSlider } from './InfiniteSlider';

const clientLogos = [
  { src: 'https://honestit.in/wp-content/uploads/2021/09/1.png', alt: 'Client 1' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/2.png', alt: 'Client 2' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/3.png', alt: 'Client 3' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/16.png', alt: 'Client 16' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/4.png', alt: 'Client 4' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/5.png', alt: 'Client 5' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/7.png', alt: 'Client 7' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/8.png', alt: 'Client 8' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/9.png', alt: 'Client 9' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/11.png', alt: 'Client 11' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/12.png', alt: 'Client 12' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/13.png', alt: 'Client 13' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/14.png', alt: 'Client 14' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/15.png', alt: 'Client 15' },
  { src: 'https://honestit.in/wp-content/uploads/2021/09/17.png', alt: 'Client 17' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/logo.1632467509.jpg', alt: 'Client Logo' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/Logo.png', alt: 'Client Logo 2' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/Gujarat-Logo_250923.jpg', alt: 'Gujarat Logo' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/aarohan-logo.png', alt: 'Aarohan Logo' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/5_edited.png', alt: 'Client Edited' },
  { src: 'https://honestit.in/wp-content/uploads/2024/09/image.png', alt: 'Client Image' },
];

export { clientLogos };

// Infinite slider version for home page
export function LogoCloudSlider() {
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-neutral-50 to-transparent z-10" />
      <InfiniteSlider gap={48} speed={60} speedOnHover={30}>
        {clientLogos.map((logo, index) => (
          <img
            key={`logo-${index}`}
            src={logo.src}
            alt={logo.alt}
            className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            loading="lazy"
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}

// Grid version for clients page
export function LogoCloudGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 rounded-2xl overflow-hidden bg-neutral-200">
      {clientLogos.map((logo, index) => (
        <div
          key={`grid-logo-${index}`}
          className="flex items-center justify-center bg-white p-6 md:p-8 hover:bg-neutral-50 transition-colors"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            className="h-10 md:h-12 w-auto object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
