import { EventModel } from '../../../core/api/events';

export enum EventModalMode {
  EDIT = 'edit',
  CREATE = 'create',
}

export interface EventModalData {
  event?: EventModel;
  mode: EventModalMode;
}
