import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import OptimizedImage from "./OptimizedImage";

// Infinite slider version for home page
export function LogoCloudSlider() {
	const { data: logos = [] } = useQuery({
		queryKey: ['clientLogos'],
		queryFn: publicApi.getClientLogos,
	});

	if (logos.length === 0) return null;

	return (
		<div className="mask-[linear-gradient(to_right,transparent,black,transparent)] overflow-hidden py-4">
			<InfiniteSlider gap={48} reverse speed={60} speedOnHover={25}>
				{logos.map((logo) => {
					const needsInvert = logo.name.toLowerCase().includes('itcs') || logo.name.toLowerCase().includes('solco');
					return (
						<OptimizedImage
							alt={logo.name}
							className={`pointer-events-none h-10 select-none md:h-12 object-contain ${needsInvert ? 'invert' : ''}`}
							key={`slider-logo-${logo.id}`}
							src={getImageUrl(logo.imageUrl)}
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
	const { data: logos = [], isLoading: loading } = useQuery({
		queryKey: ['clientLogos'],
		queryFn: publicApi.getClientLogos,
	});

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
		<div className="grid grid-cols-2 rounded-lg bg-border shadow sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{logos.map((logo) => {
				const needsInvert = logo.name.toLowerCase().includes('itcs') || logo.name.toLowerCase().includes('solco');
				return (
				<div
					className="flex items-center justify-center rounded-lg border bg-background p-6 md:p-8 overflow-hidden"
					key={`grid-logo-${logo.id}`}
				>
					<OptimizedImage
						alt={logo.name}
						className={`pointer-events-none block h-10 select-none md:h-14 object-contain ${needsInvert ? 'invert' : ''}`}
						src={getImageUrl(logo.imageUrl)}
					/>
				</div>
			);})}
		</div>
	);
}
