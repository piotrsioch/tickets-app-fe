import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'tickets-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

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
    } catch (error) {
      console.error(error);
      alert('Error during login');
    }
  }
}
