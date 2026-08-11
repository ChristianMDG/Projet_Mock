/**
 * payment-transaction router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::payment-transaction.payment-transaction', {
  config: {
    find: {
      middlewares: ['global::read-only'],
    },
    findOne: {
      middlewares: ['global::read-only'],
    },
    create: {
      middlewares: ['global::read-only'],
    },
    update: {
      middlewares: ['global::read-only'],
    },
    delete: {
      middlewares: ['global::read-only'],
    },
  },
});
