import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
        this.mensaje = "✅ Cuenta verificada. Ahora puedes iniciar sesión.";
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
  
            console.log("🔐 Token guardado en localStorage:", res.token);
            console.log("👤 Usuario guardado en localStorage:", res.user);
            console.log("🎭 Rol guardado en localStorage:", res.user.rol);
  
            this.mensaje = "✅ Inicio de sesión exitoso. Redirigiendo...";
            console.log('➡️ Redirigiendo a Home...');
  
            this.router.navigate(['/home']).then((navigated) => {
              if (navigated) {
                console.log('✅ Redirección exitosa');
              } else {
                console.error('❌ Redirección fallida');
              }
            });
  
          } else {
            this.errorMessage = "⚠️ Respuesta inesperada del servidor.";
          }
        },
        error: (err) => {
          console.error("❌ Error en login:", err);
          this.errorMessage = err.error?.message || 'Ocurrió un error, intenta más tarde.';
          this.failedAttempts++;
  
          if (this.failedAttempts > 2) {
            this.mensaje = '¿Olvidaste tu contraseña?';
          } else {
            this.mensaje = '⚠️ Credenciales incorrectas.';
          }
        }
      });
    } else {
      this.errorMessage = '⚠️ Por favor, completa todos los campos correctamente.';
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
