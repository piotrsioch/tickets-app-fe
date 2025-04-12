import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { AdminEventsComponent } from './features/admin-events/admin-events.component';
import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { EventsComponent } from './features/events/events.component';
import { EventDetailsComponent } from './features/events/event-details/event-details.component';
import { eventDetailsResolver } from './features/events/event-details/event-details.resolver';
import { CartComponent } from './features/cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [LoggedInGuard, AdminGuard],
  },
  {
    path: 'admin-events',
    component: AdminEventsComponent,
    canActivate: [LoggedInGuard, AdminGuard],
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'events/:eventId',
    component: EventDetailsComponent,
    resolve: {
      event: eventDetailsResolver,
    },
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];
