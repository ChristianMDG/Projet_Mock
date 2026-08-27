/**
 * `populate` middleware for dynamic-page
 */

export default function populate(config, { strapi }) {
  return async (ctx, next) => {
    ctx.query = {
      ...ctx.query,
      populate: {
        pageHeader: true,
        sections: {
          populate: '*',
        },
        callToAction: true,
        featuredImage: true,
      },
    };

    await next();
  };
};