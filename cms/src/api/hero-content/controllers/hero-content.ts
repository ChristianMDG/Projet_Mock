/**
 * hero-content controller
 */

import { factories } from '@strapi/strapi';

// Temporary cast until Strapi regenerates types for renamed content type
export default factories.createCoreController('api::hero-content.hero-content');
