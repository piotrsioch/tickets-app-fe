import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { ToastSeverity } from '../../core/services/types/toast.model';

@Component({
  selector: 'tickets-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
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
      this.toastService.show('Error during login', ToastSeverity.ERROR);
    }
  }
}
