// filepath: cms/src/middlewares/health.ts
// Custom health check middleware to respond 200 with JSON
// It intercepts requests to /_health and returns a richer payload
// Without affecting default Strapi behavior for other routes.

export default () => {
    return async (ctx: {
        path: string;
        status: number;
        body: { status: string; uptime: number; timestamp: string; env: string; version: string; };
    }, next: () => any) => {
        if (ctx.path === '/_health') {
            ctx.status = 200;
            ctx.body = {
                status: 'ok',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                env: process.env.NODE_ENV,
                version: process.env.npm_package_version || undefined,
            };
            return;
        }
        await next();
    };
};
