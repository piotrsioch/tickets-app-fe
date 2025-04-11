import { EventModel } from './event.model';

export type CreateEvent = Omit<EventModel, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
