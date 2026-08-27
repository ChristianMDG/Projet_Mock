/**
 * `populate` middleware for category
 *
 * Forwards the requested locale to populated `subcategories` so that each
 * subcategory entry returned matches the parent category locale.
 */

const populate = (config, { strapi }) => {
  return async (ctx, next) => {
    const locale = (ctx.query.locale as string) ?? 'fr';

    ctx.query = {
      ...ctx.query,
      locale,
      populate: {
        image: true,
        subcategories: {
          sort: ['displayOrder:asc'],
          filters: { locale: { $eq: locale } },
          populate: {
            image: true,
          },
        },
      },
      sort: ctx.query.sort ?? ['displayOrder:asc'],
      pagination: ctx.query.pagination ?? { pageSize: 100 },
    };

    await next();
  };
};
export default populate;
