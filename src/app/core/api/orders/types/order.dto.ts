import { BaseUuidModel } from '../../../../shared/models';
import { OrderStatus } from './order-status.enum';

export interface Order extends BaseUuidModel {
  userId?: string;
  tickets: TicketDto[];
  purchaseDate: Date;
  status: OrderStatus;
  clientSecret?: string;
  paymentIntentId?: string;
  totalAmount: number;
}

export interface TicketDto extends BaseUuidModel {
  eventId: number;
  userId: number;
  purchaseDate: Date;
  isUsed: boolean;
  seatNumber?: string;
}
