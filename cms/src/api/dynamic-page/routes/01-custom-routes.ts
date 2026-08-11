export default {
  routes: [
    {
      method: 'GET',
      path: '/dynamic-pages/:slug',
      handler: 'api::dynamic-page.dynamic-page.findBySlug',
      config: {
        middlewares: ['api::dynamic-page.populate'],
      },
    },
  ],
};