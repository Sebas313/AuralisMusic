import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'; // ✅ Importamos SweetAlert2

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Importa estos módulos
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  mensaje: string = ''; // Mensajes de verificación o error
  passwordVisible: boolean = false; // Alternar visibilidad de contraseña
  errorMessage: string | null = null; // Mensajes de error del servidor
  private loginSubscription: Subscription | undefined;
  failedAttempts: number = 0; // Contador de intentos fallidos

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Detectar si el usuario acaba de verificar su correo
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
          console.log("📥 Respuesta del backend:", res);
  
          if (res.token && res.user) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('userRol', res.user.rol); // ✅ Guarda el rol correctamente

            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: '✅ Redirigiendo a la página principal...',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });

            console.log('➡️ Redirigiendo a Home...');
  
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
                this.router.navigate(['/reset-password']); // Redirigir a la página de restablecimiento
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

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
