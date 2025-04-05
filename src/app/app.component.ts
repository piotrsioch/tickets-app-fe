import { Component } from '@angular/core';
import { RootLayoutComponent } from './core/components/root-layout/root-layout.component';

@Component({
  selector: 'tickets-root',
  imports: [RootLayoutComponent],
  template: '<tickets-root-layout/>',
})
export class AppComponent {}
