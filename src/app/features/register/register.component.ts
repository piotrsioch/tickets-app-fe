import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastSeverity } from '../../core/services/types/toast.model';
import { ToastService } from '../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tickets-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    email: [''],
    password: [''],
    confirmPassword: [''],
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
  });

  async onRegister() {
    try {
      const { email, password, confirmPassword, firstName, lastName, phoneNumber } = this.registerForm.value;

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!email || !password || !firstName || !lastName) {
        return;
      }

      await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber ? phoneNumber : '',
      });
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error(error);
      this.toastService.show('Error during register', ToastSeverity.ERROR);
    }
  }
}
