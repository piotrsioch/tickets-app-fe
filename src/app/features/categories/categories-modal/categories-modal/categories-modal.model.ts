import { Category } from '../../../../core/api/categories';

export enum CategoriesModalMode {
  EDIT = 'edit',
  CREATE = 'create',
}

export interface CategoriesModalData {
  category?: Category;
  mode: CategoriesModalMode;
}
