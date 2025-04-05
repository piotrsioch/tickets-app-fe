import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'tickets-root-layout',
  imports: [RouterOutlet, LoadingComponent, ToastComponent, NavbarComponent],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss',
})
export class RootLayoutComponent {}
