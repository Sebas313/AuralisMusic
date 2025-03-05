import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordVisible: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Campos incompletos',
        text: 'Por favor, completa todos los campos correctamente.',
      });
      return;
    }
  
    this.loading = true;
  
    const usuario = {
      nombre: this.registerForm.value.nombre,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };
  
    this.userService.register(usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '✅ ¡Registro exitoso!',
          text: 'Hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.registerForm.reset(); 
          this.router.navigate(['/verificar-email']); 
        });
        this.loading = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: '❌ Error al registrarse',
          text: error.error?.message || 'Hubo un problema, intenta nuevamente.',
        });
        this.loading = false;
      },
    });
  }
  
  

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
