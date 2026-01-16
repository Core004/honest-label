import { Link, useNavigate } from "react-router-dom";
import {
	FacebookIcon,
	InstagramIcon,
	LinkedinIcon,
	PhoneIcon,
	MailIcon,
	MapPinIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "@/components/ui/sparkles";
import type React from "react";
import type { ComponentProps, ReactNode } from "react";

type FooterLink = {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	external?: boolean;
	scrollTo?: string;
};

type FooterSection = {
	label: string;
	links: FooterLink[];
};

const footerLinks: FooterSection[] = [
	{
		label: "Products",
		links: [
			{ title: "Barcode Labels", href: "/products" },
			{ title: "Thermal Rolls", href: "/products" },
			{ title: "Security Labels", href: "/products" },
			{ title: "Custom Labels", href: "/products" },
		],
	},
	{
		label: "Company",
		links: [
			{ title: "About Us", href: "/about" },
			{ title: "Our Clients", href: "/clients" },
			{ title: "Industries", href: "/industries" },
			{ title: "Blog", href: "/blog" },
		],
	},
	{
		label: "Support",
		links: [
			{ title: "Contact Us", href: "/contact" },
			{ title: "FAQs", href: "/", scrollTo: "faqs" },
			{ title: "Consumables", href: "/consumables" },
			{ title: "Get a Quote", href: "/contact" },
		],
	},
	{
		label: "Connect",
		links: [
			{ title: "Facebook", href: "https://facebook.com", icon: FacebookIcon, external: true },
			{ title: "Instagram", href: "https://instagram.com", icon: InstagramIcon, external: true },
			{ title: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon, external: true },
		],
	},
];

export function Footer() {
	const navigate = useNavigate();

	const handleScrollLink = (href: string, scrollTo: string) => {
		navigate(href);
		setTimeout(() => {
			const element = document.getElementById(scrollTo);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	return (
		<footer className="relative bg-neutral-50 border-t border-neutral-200 overflow-hidden">
			{/* Sparkles Background */}
			<div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
				<Sparkles
					density={1200}
					className="absolute inset-0 h-full w-full"
					color="#000000"
					opacity={0.2}
					size={2}
					speed={0.5}
				/>
			</div>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
				{/* Top Section - Logo and Links */}
				<div className="flex flex-col lg:flex-row lg:justify-between gap-10">
					{/* Brand Section */}
					<AnimatedContainer className="lg:max-w-xs">
						<Link to="/" className="inline-block mb-4">
							<img
								src="https://honestlabel.in/wp-content/uploads/2024/12/Honest-LabelArtboard-1-copy-2@0.1x.png"
								alt="Honest Label"
								className="h-8 w-auto object-contain"
							/>
						</Link>
						<p className="text-neutral-500 text-sm leading-relaxed">
							Premium labeling solutions manufacturer based in Ahmedabad.
						</p>
					</AnimatedContainer>

					{/* Links Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{footerLinks.map((section, index) => (
							<AnimatedContainer delay={0.1 + index * 0.05} key={section.label}>
								<h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">{section.label}</h3>
								<ul className="space-y-2">
									{section.links.map((link) => (
										<li key={link.title}>
											{link.external ? (
												<a
													className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
												>
													{link.icon && <link.icon className="mr-1.5 size-3.5" />}
													{link.title}
												</a>
											) : link.scrollTo ? (
												<button
													className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
													onClick={() => handleScrollLink(link.href, link.scrollTo!)}
												>
													{link.icon && <link.icon className="mr-1.5 size-3.5" />}
													{link.title}
												</button>
											) : (
												<Link
													className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
													to={link.href}
												>
													{link.icon && <link.icon className="mr-1.5 size-3.5" />}
													{link.title}
												</Link>
											)}
										</li>
									))}
								</ul>
							</AnimatedContainer>
						))}
					</div>
				</div>

				{/* Contact Row */}
				<AnimatedContainer delay={0.3}>
					<div className="mt-10 pt-8 border-t border-neutral-200 flex flex-wrap justify-center gap-6 text-sm text-neutral-500">
						<a href="tel:+919512370018" className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
							<PhoneIcon className="size-4" />
							+91 95123 70018
						</a>
						<a href="mailto:hello@honestit.in" className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
							<MailIcon className="size-4" />
							hello@honestit.in
						</a>
						<div className="flex items-center gap-1.5">
							<MapPinIcon className="size-4" />
							Ahmedabad, Gujarat
						</div>
					</div>
				</AnimatedContainer>

				{/* Copyright */}
				<AnimatedContainer delay={0.4}>
					<div className="mt-6 text-center space-y-1">
						<p className="text-neutral-400 text-xs">
							&copy; {new Date().getFullYear()} Honest Label. All rights reserved.
						</p>
						<p className="text-neutral-400 text-xs">
							Designed by <a href="https://verinadigitalstudio.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-neutral-700 transition-colors">Verina Digital Studio</a>
						</p>
					</div>
				</AnimatedContainer>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>["className"];
	children: ReactNode;
};

function AnimatedContainer({
	className,
	delay = 0.1,
	children,
}: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
			transition={{ delay, duration: 0.8 }}
			viewport={{ once: true }}
			whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
		>
			{children}
		</motion.div>
	);
}
