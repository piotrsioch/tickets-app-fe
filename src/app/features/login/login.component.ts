import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tickets-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.loginForm.value;

      if (!email || !password) {
        return;
      }

      await this.authService.login(email, password);
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      alert('Error during login');
    }
  }
}
