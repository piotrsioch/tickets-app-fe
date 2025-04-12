export interface TicketData {
  eventId: number;
  quantity: number;
}

export interface CreateOrder {
  userId?: string;
  ticketsData: TicketData[];
}

export interface CreateOrderResponse {
  orderId: string;
  clientSecret: string;
}
