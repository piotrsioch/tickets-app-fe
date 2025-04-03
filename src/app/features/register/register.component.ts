import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'tickets-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);

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
    } catch (error) {
      console.error(error);
      alert('Error during register');
    }
  }
}
