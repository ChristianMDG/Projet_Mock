/**
 * product controller
 */

import { factories } from '@strapi/strapi';

/**
 * Represents a parsed product as returned by Strapi (only the fields we need
 * for the post-filtering step).
 */
interface ProductLike {
  tags?: unknown;
  specifications?: unknown;
  [key: string]: unknown;
}

/**
 * Represents a raw specification component entry with optional label/value.
 */
interface Specification {
  label?: unknown;
  value?: unknown;
}

const parseQueryParam = (value: string | string[] | null | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (value) {
    return String(value).split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const typeMapping: Record<string, Record<string, boolean>> = {
  new: { isNew: true },
  featured: { isFeatured: true },
  bestseller: { isBestSeller: true },
  instock: { inStock: true },
};

const matchTag = (tags: unknown, size: string): boolean =>
  Array.isArray(tags) && tags.some(tag =>
    typeof tag === 'string' && tag.toUpperCase() === size.toUpperCase()
  );

const matchSpecification = (specifications: unknown, size: string): boolean =>
  Array.isArray(specifications) && specifications.some((spec: Specification) => {
    const hasLabelAndValue = spec && typeof spec.label === 'string' && typeof spec.value === 'string';
    if (hasLabelAndValue) {
      const label = spec.label as string;
      const value = spec.value as string;
      const isSizeSpec = label.toLowerCase().includes('taille') || label.toLowerCase().includes('dimension');
      if (isSizeSpec) {
        return value.split(/[\s,;-]+/).some((w: string) => w.toUpperCase() === size.toUpperCase());
      }
    }
    return false;
  });

const productMatchesSizes = (product: ProductLike, parsedSizes: string[]): boolean =>
  parsedSizes.some(size =>
    matchTag(product.tags, size) || matchSpecification(product.specifications, size)
  );

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    const { categorySlugs, subcategorySlugs, types, sizes, priceMin, priceMax } = query;

    // Initialize or extend standard filters
    const filters: Record<string, unknown> = (query.filters as Record<string, unknown>) || {};

    // 1. Parent Category filter
    const catSlugs = parseQueryParam(categorySlugs as string | string[] | undefined);
    if (catSlugs.length > 0) {
      const existingCategory = (filters.category as Record<string, unknown>) ?? {};
      filters.category = {
        ...existingCategory,
        category: {
          ...((existingCategory.category as Record<string, unknown>) ?? {}),
          slug: { $in: catSlugs },
        },
      };
    }

    // 2. Subcategory filter
    const subSlugs = parseQueryParam(subcategorySlugs as string | string[] | undefined);
    if (subSlugs.length > 0) {
      const existingCategory = (filters.category as Record<string, unknown>) ?? {};
      filters.category = {
        ...existingCategory,
        slug: { $in: subSlugs },
      };
    }

    // 3. Types filter (new, featured, bestseller, instock)
    const parsedTypes = parseQueryParam(types as string | string[] | undefined);
    if (parsedTypes.length > 0) {
      const typeConditions = parsedTypes.map(t => typeMapping[t]).filter(Boolean);
      if (typeConditions.length > 0) {
        filters.$or = typeConditions;
      }
    }

    // 4. Price range filters
    if (priceMin != null) {
      const minVal = Number(priceMin);
      if (Number.isFinite(minVal)) {
        filters.price = {
          ...((filters.price as Record<string, unknown>) ?? {}),
          $gte: minVal,
        };
      }
    }
    if (priceMax != null) {
      const maxVal = Number(priceMax);
      if (Number.isFinite(maxVal)) {
        filters.price = {
          ...((filters.price as Record<string, unknown>) ?? {}),
          $lte: maxVal,
        };
      }
    }

    // Assign the built filters back to query context so the database query builder picks them up
    ctx.query.filters = filters;

    // Delete custom parameters so they don't pollute core Strapi document queries
    const customParams = ['categorySlugs', 'subcategorySlugs', 'types', 'sizes', 'priceMin', 'priceMax'];
    customParams.forEach(param => delete ctx.query[param]);

    // Run core Strapi document finding, population, and pagination
    const { data, meta } = await super.find(ctx);

    // 5. Size tag and specifications post-filtering
    const parsedSizes = parseQueryParam(sizes as string | string[] | undefined);
    if (parsedSizes.length > 0 && Array.isArray(data)) {
      return {
        data: (data as ProductLike[]).filter(product => productMatchesSizes(product, parsedSizes)),
        meta,
      };
    }

    return { data, meta };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { query } = ctx;

    const entities = await strapi.documents('api::product.product').findMany({
      ...query,
      filters: { slug },
    });

    const hasResults = Array.isArray(entities) && entities.length > 0;
    if (hasResults) {
      const entityToReturn = entities[0];
      const sanitizedEntity = await this.sanitizeOutput(entityToReturn, ctx);
      return this.transformResponse(sanitizedEntity);
    }

    return ctx.notFound('Product not found');
  },
}));
