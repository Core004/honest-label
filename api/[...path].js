// Single catch-all serverless function to stay within Vercel Hobby plan limit (12 functions)
// Routes all /api/* requests to the correct handler in lib/handlers/

import productsIndex from '../lib/handlers/products/index.js';
import productsSlug from '../lib/handlers/products/[slug].js';
import productsAdmin from '../lib/handlers/products/admin.js';

import categoriesIndex from '../lib/handlers/categories/index.js';
import categoriesSlug from '../lib/handlers/categories/[slug].js';
import categoriesAdmin from '../lib/handlers/categories/admin.js';

import blogIndex from '../lib/handlers/blog/index.js';
import blogSlug from '../lib/handlers/blog/[slug].js';
import blogAdmin from '../lib/handlers/blog/admin.js';

import industriesIndex from '../lib/handlers/industries/index.js';
import industriesSlug from '../lib/handlers/industries/[slug].js';
import industriesAdmin from '../lib/handlers/industries/admin.js';

import consumablesIndex from '../lib/handlers/consumables/index.js';
import consumablesSlug from '../lib/handlers/consumables/[slug].js';
import consumablesAdmin from '../lib/handlers/consumables/admin.js';

import inquiriesIndex from '../lib/handlers/inquiries/index.js';
import inquiriesId from '../lib/handlers/inquiries/[id].js';

import quoterequestsIndex from '../lib/handlers/quoterequests/index.js';
import quoterequestsId from '../lib/handlers/quoterequests/[id].js';

import faqsIndex from '../lib/handlers/faqs/index.js';
import faqsId from '../lib/handlers/faqs/[id].js';
import faqsCategory from '../lib/handlers/faqs/category/[category].js';

import clientlogosIndex from '../lib/handlers/clientlogos/index.js';
import clientlogosId from '../lib/handlers/clientlogos/[id].js';
import clientlogosAdmin from '../lib/handlers/clientlogos/admin.js';

import teammembersIndex from '../lib/handlers/teammembers/index.js';
import teammembersId from '../lib/handlers/teammembers/[id].js';
import teammembersAdmin from '../lib/handlers/teammembers/admin.js';

import testimonialsIndex from '../lib/handlers/testimonials/index.js';
import testimonialsId from '../lib/handlers/testimonials/[id].js';
import testimonialsAdmin from '../lib/handlers/testimonials/admin.js';

import homecontentIndex from '../lib/handlers/homecontent/index.js';
import homecontentId from '../lib/handlers/homecontent/[id].js';
import homecontentUpsert from '../lib/handlers/homecontent/upsert.js';
import homecontentSection from '../lib/handlers/homecontent/section/[section].js';

import pagesettingsIndex from '../lib/handlers/pagesettings/index.js';
import pagesettingsSlug from '../lib/handlers/pagesettings/[slug].js';
import pagesettingsAll from '../lib/handlers/pagesettings/all.js';
import pagesettingsCheck from '../lib/handlers/pagesettings/check/[slug].js';
import pagesettingsToggle from '../lib/handlers/pagesettings/toggle/[id].js';

import uploadImage from '../lib/handlers/upload/image.js';
import uploadImages from '../lib/handlers/upload/images.js';
import uploadList from '../lib/handlers/upload/list.js';

import settingsIndex from '../lib/handlers/settings/index.js';

import authLogin from '../lib/handlers/auth/login.js';
import authMe from '../lib/handlers/auth/me.js';
import authChangePassword from '../lib/handlers/auth/change-password.js';

import adminDashboard from '../lib/handlers/admin/dashboard.js';

// Routes ordered from most specific to least specific
// Each route: [pattern, handler, paramMap]
// paramMap maps regex capture group index to query param name
const routes = [
  // Auth
  [/^auth\/login$/, authLogin],
  [/^auth\/me$/, authMe],
  [/^auth\/change-password$/, authChangePassword],

  // Admin
  [/^admin\/dashboard$/, adminDashboard],

  // Upload
  [/^upload\/image$/, uploadImage],
  [/^upload\/images$/, uploadImages],
  [/^upload\/list$/, uploadList],

  // Settings
  [/^settings$/, settingsIndex],

  // Products
  [/^products\/admin$/, productsAdmin],
  [/^products$/, productsIndex],
  [/^products\/(.+)$/, productsSlug, { 1: 'slug' }],

  // Categories
  [/^categories\/admin$/, categoriesAdmin],
  [/^categories$/, categoriesIndex],
  [/^categories\/(.+)$/, categoriesSlug, { 1: 'slug' }],

  // Blog
  [/^blog\/admin$/, blogAdmin],
  [/^blog$/, blogIndex],
  [/^blog\/(.+)$/, blogSlug, { 1: 'slug' }],

  // Industries
  [/^industries\/admin$/, industriesAdmin],
  [/^industries$/, industriesIndex],
  [/^industries\/(.+)$/, industriesSlug, { 1: 'slug' }],

  // Consumables
  [/^consumables\/admin$/, consumablesAdmin],
  [/^consumables$/, consumablesIndex],
  [/^consumables\/(.+)$/, consumablesSlug, { 1: 'slug' }],

  // FAQs - specific routes before dynamic
  [/^faqs\/category\/(.+)$/, faqsCategory, { 1: 'category' }],
  [/^faqs$/, faqsIndex],
  [/^faqs\/(.+)$/, faqsId, { 1: 'id' }],

  // Inquiries
  [/^inquiries$/, inquiriesIndex],
  [/^inquiries\/(.+)$/, inquiriesId, { 1: 'id' }],

  // Quote Requests
  [/^quoterequests$/, quoterequestsIndex],
  [/^quoterequests\/(.+)$/, quoterequestsId, { 1: 'id' }],

  // Client Logos
  [/^clientlogos\/admin$/, clientlogosAdmin],
  [/^clientlogos$/, clientlogosIndex],
  [/^clientlogos\/(.+)$/, clientlogosId, { 1: 'id' }],

  // Team Members
  [/^teammembers\/admin$/, teammembersAdmin],
  [/^teammembers$/, teammembersIndex],
  [/^teammembers\/(.+)$/, teammembersId, { 1: 'id' }],

  // Testimonials
  [/^testimonials\/admin$/, testimonialsAdmin],
  [/^testimonials$/, testimonialsIndex],
  [/^testimonials\/(.+)$/, testimonialsId, { 1: 'id' }],

  // Home Content - specific routes before dynamic
  [/^homecontent\/upsert$/, homecontentUpsert],
  [/^homecontent\/section\/(.+)$/, homecontentSection, { 1: 'section' }],
  [/^homecontent$/, homecontentIndex],
  [/^homecontent\/(.+)$/, homecontentId, { 1: 'id' }],

  // Page Settings - specific routes before dynamic
  [/^pagesettings\/all$/, pagesettingsAll],
  [/^pagesettings\/check\/(.+)$/, pagesettingsCheck, { 1: 'slug' }],
  [/^pagesettings\/toggle\/(.+)$/, pagesettingsToggle, { 1: 'id' }],
  [/^pagesettings$/, pagesettingsIndex],
  [/^pagesettings\/(.+)$/, pagesettingsSlug, { 1: 'slug' }],
];

export default async function handler(req, res) {
  // Vercel passes catch-all as req.query['...path'] (string) or req.query.path (array)
  const raw = req.query['...path'] || req.query.path || [];
  const pathSegments = Array.isArray(raw) ? raw : raw.split('/').filter(Boolean);
  const pathname = pathSegments.join('/');

  for (const [pattern, routeHandler, paramMap] of routes) {
    const match = pathname.match(pattern);
    if (match) {
      // Inject dynamic params into req.query (mimicking Vercel's [param] behavior)
      if (paramMap) {
        for (const [groupIndex, paramName] of Object.entries(paramMap)) {
          req.query[paramName] = match[groupIndex];
        }
      }
      return routeHandler(req, res);
    }
  }

  return res.status(404).json({ error: 'API route not found' });
}
