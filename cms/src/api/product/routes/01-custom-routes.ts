export default {
  routes: [
    {
      method: 'GET',
      path: '/products/:slug',
      handler: 'api::product.product.findBySlug',
      config: {
        middlewares: ['api::product.populate'],
      },
    },
  ],
};
