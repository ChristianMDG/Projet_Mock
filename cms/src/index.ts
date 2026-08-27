import type { Core } from '@strapi/strapi';

type Permission = { action: string; id?: number };

export default {
  register() { },
  async bootstrap({ }: { strapi: Core.Strapi }) { },
};
