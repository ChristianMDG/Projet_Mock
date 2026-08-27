/**
 * `populate` middleware for product-category
 *
 * Forwards the requested locale to the populated parent `category` relation
 * so the returned category matches the requested locale.
 */

const populate = (config, { strapi }) => {
  return async (ctx, next) => {
    const locale = (ctx.query.locale as string) ?? 'fr';

    ctx.query = {
      ...ctx.query,
      locale,
      populate: {
        category: {
          filters: { locale: { $eq: locale } },
        },
        image: true,
      },
      sort: ctx.query.sort ?? ['displayOrder:asc'],
      pagination: ctx.query.pagination ?? { pageSize: 100 },
    };

    await next();
  };
};
export default populate;
