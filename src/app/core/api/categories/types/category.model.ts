import { BaseModel } from '../../../../shared/models';

export interface Category extends BaseModel {
  id: number;
  name: string;
  description: string;
  parentCategoryId?: number;
  subcategories?: Category[];
}
