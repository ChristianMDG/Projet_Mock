/**
 * payment-method controller
 */

import { factories } from '@strapi/strapi';

// Temporary cast until Strapi regenerates types for new content type
export default factories.createCoreController('api::payment-method.payment-method');