/**
 * `populate` middleware for seller
 *
 * Ensures the seller `avatarImage` media is populated on find/findOne.
 */

const populate = (config, { strapi }) => {
  return async (ctx, next) => {
    const locale = (ctx.query.locale as string) ?? 'fr';

    ctx.query = {
      ...ctx.query,
      locale,
      populate: {
        avatarImage: true,
      },
      sort: ctx.query.sort ?? ['name:asc'],
      pagination: ctx.query.pagination ?? { pageSize: 100 },
    };

    await next();
  };
};
export default populate;
