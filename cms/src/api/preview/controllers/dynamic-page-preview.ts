/**
 * preview controller for dynamic pages
 */

export default {
  async dynamicPage(ctx) {
    try {
      const { id, locale = 'fr' } = ctx.params;
      
      if (!id) {
        return ctx.badRequest('Page ID is required');
      }

      // Fetch the dynamic page with all relations
      const page = await strapi.documents('api::dynamic-page.dynamic-page').findOne({
        documentId: id,
        locale,
        populate: {
          pageHeader: true,
          sections: {
            populate: {
              measures: true,
              insuranceTypes: true,
              tips: true,
              contacts: true,
              faqs: true,
              paragraphs: true,
              routes: true,
              promotions: {
                populate: {
                  image: true,
                },
              },
              categories: {
                populate: {
                  articles: true,
                },
              },
              services: {
                populate: {
                  features: true,
                },
              },
              contactMethods: true,
              sections: true,
              destinations: {
                populate: {
                  attractions: true,
                  image: true,
                },
              },
            },
          },
          callToAction: true,
          featuredImage: true,
        },
      });

      if (!page) {
        return ctx.notFound('Dynamic page not found');
      }

      // Generate preview URL
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
      const previewUrl = `${frontendUrl}/preview/dynamic-page/${id}?locale=${locale}`;

      // Return preview data
      return {
        page,
        previewUrl,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Preview error:', error);
      return ctx.internalServerError('Failed to generate preview');
    }
  },

  async dynamicPageBySlug(ctx) {
    try {
      const { slug, locale = 'fr' } = ctx.params;
      
      if (!slug) {
        return ctx.badRequest('Page slug is required');
      }

      // Fetch the dynamic page by slug
      const pages = await strapi.documents('api::dynamic-page.dynamic-page').findMany({
        locale,
        filters: { slug },
        populate: {
          pageHeader: true,
          sections: {
            populate: {
              measures: true,
              insuranceTypes: true,
              tips: true,
              contacts: true,
              faqs: true,
              paragraphs: true,
              routes: true,
              promotions: {
                populate: {
                  image: true,
                },
              },
              categories: {
                populate: {
                  articles: true,
                },
              },
              services: {
                populate: {
                  features: true,
                },
              },
              contactMethods: true,
              sections: true,
              destinations: {
                populate: {
                  attractions: true,
                  image: true,
                },
              },
            },
          },
          callToAction: true,
          featuredImage: true,
        },
      });

      const page = Array.isArray(pages) ? pages[0] : pages;

      if (!page) {
        return ctx.notFound('Dynamic page not found');
      }

      // Generate preview URL
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
      const previewUrl = `${frontendUrl}/preview/dynamic-page/slug/${slug}?locale=${locale}`;

      // Return preview data
      return {
        page,
        previewUrl,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Preview error:', error);
      return ctx.internalServerError('Failed to generate preview');
    }
  },
};