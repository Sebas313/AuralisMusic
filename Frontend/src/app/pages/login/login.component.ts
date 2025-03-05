import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  mensaje: string = ''; 
  passwordVisible: boolean = false; 
  errorMessage: string | null = null;
  private loginSubscription: Subscription | undefined;
  failedAttempts: number = 0; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      if (params['verified']) {
        Swal.fire('Cuenta Verificada', '✅ Ahora puedes iniciar sesión.', 'success');
      }
    });

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
        next: (res) => {
         
  
          if (res.token && res.user) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('userRol', res.user.rol); 

            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: '✅ Redirigiendo a la página principal...',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });

  
  
            this.router.navigate(['/home']).then((navigated) => {
              if (!navigated) {
                Swal.fire('Error', '❌ No se pudo redirigir a la página principal.', 'error');
              }
            });
          } else {
            Swal.fire('Error', '⚠️ Respuesta inesperada del servidor.', 'warning');
          }
        },
        error: (err) => {
          console.error("❌ Error en login:", err);
          this.errorMessage = err.error?.message || 'Ocurrió un error, intenta más tarde.';
          this.failedAttempts++;
  
          if (this.failedAttempts > 2) {
            Swal.fire({
              title: '¿Olvidaste tu contraseña?',
              text: 'Puedes restablecerla ahora.',
              icon: 'info',
              confirmButtonText: 'Restablecer',
              showCancelButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/reset-password']);
              }
            });
          } else {
            Swal.fire('Error', '⚠️ Credenciales incorrectas.', 'error');
          }
        }
      });
    } else {
      Swal.fire('Error', '⚠️ Por favor, completa todos los campos correctamente.', 'error');
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
