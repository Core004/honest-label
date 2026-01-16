import { useEffect, useState } from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL.replace('/api', '')}${url}`;
};

interface ClientLogo {
  id: number;
  name: string;
  imageUrl: string;
  website?: string;
  isActive: boolean;
  displayOrder: number;
}

// Infinite slider version for home page
export function LogoCloudSlider() {
	const [logos, setLogos] = useState<ClientLogo[]>([]);

	useEffect(() => {
		fetch(`${API_URL}/clientlogos`)
			.then(res => res.json())
			.then(data => setLogos(data))
			.catch(err => console.error('Failed to fetch logos:', err));
	}, []);

	if (logos.length === 0) return null;

	return (
		<div className="mask-[linear-gradient(to_right,transparent,black,transparent)] overflow-hidden py-4">
			<InfiniteSlider gap={48} reverse speed={60} speedOnHover={25}>
				{logos.map((logo) => {
					const needsInvert = logo.name.toLowerCase().includes('itcs') || logo.name.toLowerCase().includes('solco');
					return (
						<img
							alt={logo.name}
							className={`pointer-events-none h-10 select-none md:h-12 object-contain ${needsInvert ? 'invert' : ''}`}
							height="auto"
							key={`slider-logo-${logo.id}`}
							loading="lazy"
							src={getImageUrl(logo.imageUrl)}
							width="auto"
						/>
					);
				})}
			</InfiniteSlider>
		</div>
	);
}

// Animation variants for container
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
};

// Animation variants for each logo card
const cardVariants = {
	hidden: {
		opacity: 0,
		y: 40,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: "spring",
			damping: 20,
			stiffness: 100,
		},
	},
};

// Grid version for clients page with animations
export function LogoCloud() {
	const [logos, setLogos] = useState<ClientLogo[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_URL}/clientlogos`)
			.then(res => res.json())
			.then(data => {
				setLogos(data);
				setLoading(false);
			})
			.catch(err => {
				console.error('Failed to fetch logos:', err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
			</div>
		);
	}

	if (logos.length === 0) {
		return (
			<div className="text-center py-12 text-neutral-500">
				No client logos available.
			</div>
		);
	}

	return (
		<motion.div
			className="grid grid-cols-2 rounded-lg bg-border shadow sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{logos.map((logo) => {
				const needsInvert = logo.name.toLowerCase().includes('itcs') || logo.name.toLowerCase().includes('solco');
				return (
				<motion.div
					className="flex items-center justify-center rounded-lg border bg-background p-6 md:p-8 overflow-hidden"
					key={`grid-logo-${logo.id}`}
					variants={cardVariants}
					whileHover={{
						scale: 1.05,
						backgroundColor: "rgba(249, 250, 251, 1)",
						boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.1)",
						transition: { duration: 0.3, ease: "easeOut" },
					}}
					whileTap={{ scale: 0.98 }}
				>
					<motion.img
						alt={logo.name}
						className={`pointer-events-none block h-8 select-none md:h-10 object-contain ${needsInvert ? 'invert' : ''}`}
						height="auto"
						loading="lazy"
						src={getImageUrl(logo.imageUrl)}
						width="auto"
						whileHover={{
							scale: 1.1,
							transition: { duration: 0.3, ease: "easeOut" },
						}}
					/>
				</motion.div>
			);})}
		</motion.div>
	);
}
