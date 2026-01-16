import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const faqs = [
  {
    question: "What types of labels do you manufacture?",
    answer: "We manufacture a wide range of labels including barcode labels, thermal transfer labels, direct thermal labels, security labels, holographic labels, RFID labels, weatherproof labels, and custom printed labels for various industries like retail, logistics, pharmaceuticals, and food & beverage."
  },
  {
    question: "What is the minimum order quantity?",
    answer: "Our minimum order quantity varies depending on the type of label and customization required. For standard labels, we can accommodate smaller orders, while custom printed labels typically require a minimum of 5,000 pieces. Contact us for specific requirements."
  },
  {
    question: "How long does production and delivery take?",
    answer: "Standard labels are typically dispatched within 2-3 business days. Custom printed labels usually take 5-7 business days depending on complexity. We also offer express production for urgent orders. All orders within Gujarat are typically delivered within 1-2 days after dispatch."
  },
  {
    question: "Do you offer free samples?",
    answer: "Yes! We offer free sample packs for new customers. This allows you to test the quality, adhesion, and compatibility of our labels with your products and printers before placing a bulk order. Request your free sample through our contact form."
  },
  {
    question: "Can you match specific Pantone colors for branding?",
    answer: "Absolutely. Our 8-color printing presses can accurately match Pantone colors to ensure your labels perfectly align with your brand identity. We provide color proofs for approval before production begins."
  },
  {
    question: "What materials are available for labels?",
    answer: "We offer labels in various materials including paper (matte, gloss, thermal), synthetic materials (PP, PE, PET), vinyl, polyester, and eco-friendly options like biodegradable and recyclable materials. Each material is suited for different applications and environments."
  },
  {
    question: "Do you provide barcode printing services?",
    answer: "Yes, we manufacture both pre-printed barcode labels and blank thermal labels for on-demand printing. We support all major barcode formats including Code 128, Code 39, UPC, EAN, QR codes, and Data Matrix. We can also provide variable data printing for unique serial numbers."
  },
  {
    question: "What adhesive options are available?",
    answer: "We offer permanent, removable, freezer-grade, high-tack, and specialty adhesives. Our team can recommend the best adhesive based on your application surface (glass, plastic, cardboard, metal) and environmental conditions (cold storage, outdoor, high humidity)."
  }
];

export function FaqsSection() {
  return (
    <motion.section
      id="faqs"
      className="py-24 bg-neutral-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold tracking-wide uppercase text-indigo-600">
            FAQs
          </h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-900">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-lg text-neutral-500">
            Everything you need to know about our labeling solutions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`} className="border-b border-neutral-200">
                  <AccordionTrigger className="text-left text-neutral-900 hover:text-neutral-700 py-5 text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
}
