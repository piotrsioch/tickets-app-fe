import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'tickets-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;

  async onLogout() {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
