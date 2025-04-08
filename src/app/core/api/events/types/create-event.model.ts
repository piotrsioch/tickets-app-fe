import {Event} from './event.model';

export type CreateEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
