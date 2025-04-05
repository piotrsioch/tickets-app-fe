import { BaseModel } from '../../../../shared/models';

export interface Event extends BaseModel {
  name: string;
  eventDate: Date;
  venue: string;
  mainCategoryId: number;
  subcategoriesIds: number[];
  description?: string;
  availableTickets: number;
  pricePerTicket: number;
  salesStartDate: Date;
  salesEndDate: Date;
  duration: number;
}
