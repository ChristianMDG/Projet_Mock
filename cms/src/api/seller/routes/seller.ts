/**
 * seller router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::seller.seller', {
  config: {
    find: {
      middlewares: ['api::seller.populate'],
    },
    findOne: {
      middlewares: ['api::seller.populate'],
    },
  },
});
