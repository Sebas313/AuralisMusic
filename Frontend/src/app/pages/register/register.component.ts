import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  showVerificationModal = false;  
  verificationCode = '';  
  email = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthService,  // ✅ Inyectar AuthService aquí
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
      this.errorMessage = '⚠️ Por favor, completa todos los campos correctamente.';
      
      setTimeout(() => this.errorMessage = null, 3000);
      return;
    }
  
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
  
    const usuario = {
      nombre: this.registerForm.value?.nombre || '',
      email: this.registerForm.value?.email || '',
      password: this.registerForm.value?.password || ''
    };
  
    this.userService.register(usuario).subscribe({
      next: (response) => {
        this.successMessage = '✅ ¡Registro exitoso!';
        this.errorMessage = null;
        this.loading = false;
  
     
        this.email = usuario.email;
        this.showVerificationModal = true;
      },
      error: (error) => {
        console.error("Error al registrar el usuario:", error);
  
       
        this.errorMessage = error.error?.message ? `⚠️ ${error.error.message}` : '❌ Error al registrar el usuario.';
  
        this.loading = false;
  
        
        setTimeout(() => this.errorMessage = null, 3000);
      },
    });
  }
  
  closeAlert() {
    this.errorMessage = null;
    this.successMessage = null;
  }
  


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  verifyCode() {
    this.authService.verifyCode(this.email, this.verificationCode).subscribe(response => {  
      if (response.success) {
        alert('Código verificado. Ahora puedes iniciar sesión.');
        this.showVerificationModal = false; 
        this.router.navigate(['/login']); 
      } else {
        alert('Código incorrecto. Intenta de nuevo.');
      }
    });
  }

  closeModal() {
    this.showVerificationModal = false;
  }
}
