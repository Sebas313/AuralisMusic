import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],  
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordVisible: boolean = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      avatar: [null],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true; 
      this.errorMessage = null; 
      this.successMessage = null; 

      const formData = new FormData();
      formData.append('nombre', this.registerForm.value.nombre);
      formData.append('email', this.registerForm.value.email);
      formData.append('password', this.registerForm.value.password);

      // Verifica que avatar no sea null o undefined antes de agregarlo
      if (this.registerForm.value.avatar) {
        formData.append('avatar', this.registerForm.value.avatar);
      }

      this.userService.register(formData).subscribe({
        next: (response) => {
          this.successMessage = '¡Registro exitoso!';
          this.errorMessage = null;
          this.loading = false;

          // Redirigir al usuario a la página de inicio de sesión o principal
          this.router.navigate(['/login']);  // O redirige según sea necesario
        },
        error: (error) => {
          console.error("Error al registrar el usuario:", error);
          this.errorMessage = error.error?.message || 'Error al registrar el usuario.';
          this.loading = false; 
        },
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Validar tipo de archivo y tamaño
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.errorMessage = 'Por favor, selecciona un archivo de imagen válido (JPEG o PNG)';
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // Limitar a 2MB
        this.errorMessage = 'El tamaño del archivo debe ser menor a 2MB';
        return;
      }
  
      // Asignar el archivo al campo avatar en el formulario
      this.registerForm.patchValue({ avatar: file });
      this.errorMessage = null; // Limpiar mensajes de error si el archivo es válido
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
