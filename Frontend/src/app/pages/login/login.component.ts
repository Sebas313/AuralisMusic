import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],  // Importa estos módulos aquí
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  private loginSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (this.loginSubscription) {
        this.loginSubscription.unsubscribe();
      }

      this.loginSubscription = this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.loginForm.reset();
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          } else if (error.status === 500) {
            this.errorMessage = 'Error del servidor. Por favor, intenta más tarde.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, intenta más tarde.';
          }
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
