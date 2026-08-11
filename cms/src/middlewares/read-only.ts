/**
 * Shared read-only middleware
 * Blocks POST, PUT, DELETE requests - allows only GET requests
 * Use this middleware for resources that should be read-only in the CMS
 */

export default () => {
  return async (ctx, next) => {
    const method = ctx.request.method.toUpperCase();
    
    // Allow only GET requests
    if (method !== 'GET') {
      ctx.status = 403;
      ctx.body = {
        error: {
          status: 403,
          name: 'ForbiddenError',
          message: 'This resource is read-only. Modifications are not allowed.',
        },
      };
      return;
    }
    
    await next();
  };
};
