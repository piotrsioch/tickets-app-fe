import { BaseModel } from '../../../../shared/models';
import { Category } from '../../categories';

export interface Event extends BaseModel {
  name: string;
  eventDate: Date;
  venue: string;
  mainCategory?: Category;
  subcategories?: Category[];
  mainCategoryId: number;
  subcategoriesIds?: number[];
  description?: string;
  imageUrl?: string;
  availableTickets: number;
  pricePerTicket: number;
  salesStartDate: Date;
  salesEndDate: Date;
  duration: number;
}
