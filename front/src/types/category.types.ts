import type { Base } from '@/models/Base';
import type { StrapiMedia } from '@/types/cms.types';

export interface Category extends Base {
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  image?: StrapiMedia;
  isActive?: boolean;
  displayOrder?: number;
  subcategories?: ProductCategory[];
}

export interface ProductCategory extends Base {
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  image?: StrapiMedia;
  isActive?: boolean;
  displayOrder?: number;
  parentId?: number;
  category?: Category;
}

export interface CategoryReorderItem {
  id: number;
  displayOrder: number;
  parentId?: number;
}

export interface CategoryReorderRequest {
  items: CategoryReorderItem[];
}
