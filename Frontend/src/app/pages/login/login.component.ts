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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  passwordVisible: boolean = false;
  loginForm: FormGroup;
  errorMessage: string = '';
  private loginSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Si el usuario ya tiene sesión, redirigir a home
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
            this.router.navigate(['/']); // Redirigir a home después de iniciar sesión
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage =
            error.status === 401
              ? 'Credenciales incorrectas. Por favor, inténtalo de nuevo.'
              : error.status === 500
              ? 'Error del servidor. Por favor, intenta más tarde.'
              : 'Ocurrió un error inesperado. Por favor, intenta más tarde.';
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
