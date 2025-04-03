import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'tickets-root-layout',
  imports: [RouterOutlet, LoadingComponent, ToastComponent],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.scss',
})
export class RootLayoutComponent {}
