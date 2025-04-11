import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { AdminEventsComponent } from './features/events/admin-events/admin-events.component';
import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

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
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];
