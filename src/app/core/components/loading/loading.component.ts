import { Component, inject, Signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'tickets-loading',
  imports: [MatProgressSpinner],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  loadingService = inject(LoadingService);

  loading: Signal<boolean> = this.loadingService.loading;
}
