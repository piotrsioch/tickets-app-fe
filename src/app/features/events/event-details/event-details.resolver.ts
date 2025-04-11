import { Event, EventsApiService } from '../../../core/api/events';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const eventDetailsResolver: ResolveFn<Event | null> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const eventId = Number(route.paramMap.get('eventId'));

  if (!eventId) {
    return null;
  }

  const eventsApiService = inject(EventsApiService);

  return eventsApiService.getEventById(eventId);
};
