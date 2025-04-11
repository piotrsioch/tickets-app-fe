import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tickets-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {}
