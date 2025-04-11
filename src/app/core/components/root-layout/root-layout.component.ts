import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'tickets-root-layout',
  imports: [RouterOutlet, LoadingComponent, ToastComponent, NavbarComponent],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss',
})
export class RootLayoutComponent implements OnInit {
  router = inject(Router);
  isUnauthorized = signal<boolean>(false);

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(_event => {
        const isUnauthorized = this.router.getCurrentNavigation()?.extras?.state?.['unauthorized'];
        this.isUnauthorized.set(!!isUnauthorized);
      });
  }
}
