/**
 * product-category router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::product-category.product-category', {
  config: {
    find: {
      middlewares: ['api::product-category.populate'],
    },
    findOne: {
      middlewares: ['api::product-category.populate'],
    },
  },
});
