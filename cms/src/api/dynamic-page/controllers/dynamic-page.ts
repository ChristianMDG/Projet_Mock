/**
 * dynamic-page controller
 */

import { factories } from '@strapi/strapi'

const populateConfig = {
  populate: {
    sections: {
      on: {
        "page.payment-section": {
          populate: {
            paymentMethods: {
              populate: {
                logo: {
                  fields: ["url", "alternativeText", "name"],
                },
              },
            },
          },
        },
        "page.section-reference": { populate: "*" },
        "rental.hero-section": {
          populate: {
            backgroundImage: "*",
          },
        },
        "rental.categories-section": {
          populate: {
            categories: {
              populate: {
                image: "*",
              },
            },
          },
        },
        "rental.how-it-works": {
          populate: {
            steps: "*",
          },
        },
        "rental.featured-vehicles": {
          populate: {
            vehicles: {
              populate: {
                image: "*",
              },
            },
          },
        },
        "rental.offers-section": {
          populate: {
            offers: {
              populate: {
                image: "*",
              },
            },
          },
        },
        "rental.reassurance-section": {
          populate: {
            indicators: "*",
          },
        },
        "rental.faq-section": {
          populate: {
            faqs: "*",
          },
        },
        "rental.contact-section": { populate: "*" },
        "page.safety-measures": { populate: "*" },
        "page.insurance-coverage": { populate: "*" },
        "page.safety-tips": { populate: "*" },
        "page.emergency-contacts": { populate: "*" },
        "page.faq-section": { populate: "*" },
        "page.about-us-section": { populate: "*" },
        "page.popular-routes": { populate: "*" },
        "page.current-promotions": { populate: "*" },
        "page.help-center-section": {
          populate: {
            categories: {
              populate: {
                articles: "*",
              },
            },
          },
        },
        "page.service-types": {
          populate: {
            services: {
              populate: {
                features: "*",
              },
            },
          },
        },
        "page.contact-section": { populate: "*" },
        "page.legal-content": { populate: "*" },
        "page.destinations-grid": { populate: "*" },
        "page.popular-destinations": {
          populate: {
            destinations: {
              populate: {
                image: {
                  fields: ["url", "alternativeText", "name"],
                },
                attractions: true,
              },
            },
          },
        },
        "page.customer-testimonials": { populate: "*" },
        "page.why-choose-us": { populate: "*" },
        "page.promotional-content": { populate: "*" },
        "page.statistics-section": { populate: "*" },
        "page.network-section": { populate: "*" },
        "page.mission-section": { populate: "*" },
        "page.values-section": { populate: "*" },
        "page.additional-info": { populate: "*" },
        "page.additional-services": { populate: "*" },
        "page.booking-rules": { populate: "*" },
        "page.loyalty-program": {
          populate: {
            levels: {
              populate: {
                benefits: true,
              },
            },
          },
        },
        "page.service-categories": {
          populate: {
            categories: {
              populate: {
                services: true,
              },
            },
          },
        },
        "page.simple-search": {
          populate: {
            image: {
              fields: ["url", "alternativeText", "name"],
            },
          },
        },
      },
    },
    pageHeader: true,
    callToAction: true,
    featuredImage: true,
  },
};

export default factories.createCoreController('api::dynamic-page.dynamic-page', ({ strapi }) => ({
  async find(ctx) {
    const options = { 
      ...ctx.query, 
      populate: { 
        pageHeader: true,
        featuredImage: {
          fields: ['url', 'alternativeText', 'name']
        }
      },
      fields: ['title', 'slug', 'icon'],
    };

    const entity = await strapi.documents('api::dynamic-page.dynamic-page').findMany(options as any);
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.documents('api::dynamic-page.dynamic-page').findOne({
      ...query,
      documentId: id,
      ...populateConfig,
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.documents('api::dynamic-page.dynamic-page').findMany({
      ...query,
      filters: { slug },
      ...populateConfig,
    });

    if (!entities?.length) {
      return ctx.notFound('Page not found');
    }

    const entityToReturn = Array.isArray(entities) ? entities[0] : entities;

    if (query.sectionType && entityToReturn.sections) {
      entityToReturn.sections = entityToReturn.sections.filter(
        (s: any) => s.__component === query.sectionType
      );
    }

    const sanitizedEntity = await this.sanitizeOutput(entityToReturn, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));