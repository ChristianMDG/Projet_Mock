/**
 * payment-method router
 */

import { factories } from '@strapi/strapi';

// Temporary cast until Strapi regenerates types for new content type
export default factories.createCoreRouter('api::payment-method.payment-method');