/**
 * payment-method service
 */

import { factories } from '@strapi/strapi';

// Temporary cast until Strapi regenerates types for new content type
export default factories.createCoreService('api::payment-method.payment-method');