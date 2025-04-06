export type CreateEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
