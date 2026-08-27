/**
 * `populate` middleware for product
 *
 * Forwards the requested locale to populated relations so that:
 *  - the product `category` (subcategory) matches the locale, and its parent
 *    top-level `category` is also populated for that locale, and
 *  - the `seller` relation is populated with its `avatarImage`.
 */

const populate = (config, { strapi }) => {
  return async (ctx, next) => {
    const locale = (ctx.query.locale as string) ?? 'fr';

    ctx.query = {
      ...ctx.query,
      locale,
      populate: {
        images: true,
        category: {
          filters: { locale: { $eq: locale } },
          populate: {
            image: true,
            category: {
              filters: { locale: { $eq: locale } },
            },
          },
        },
        seller: {
          populate: {
            avatarImage: true,
          },
        },
      },
      sort: ctx.query.sort ?? ['name:asc'],
      pagination: ctx.query.pagination ?? { pageSize: 100 },
    };

    await next();
  };
};
export default populate;
