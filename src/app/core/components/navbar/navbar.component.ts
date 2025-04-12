import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserRole } from '../../services/types/decoded-token.model';

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
  userRole = this.authService.userRole;

  async onLogout() {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }

  protected readonly UserRole = UserRole;
}
