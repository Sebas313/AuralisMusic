import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css']
})
export class VerificarEmailComponent implements OnInit {
  
  isLoading: boolean = false; // Indicador de carga
  errorMessage: string = '';   // Mensaje de error

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
  
      if (token) {
        this.isLoading = true; // Activar el indicador de carga
        
        this.userService.verifyEmail(token).subscribe({
          next: (response) => {
            console.log('📥 Respuesta del backend:', response);
            this.isLoading = false; // Desactivar el indicador de carga
            if (response?.success && response?.token) {
              localStorage.setItem('authToken', response.token);
              this.router.navigate(['/login']); // ✅ Redirige al login
            } else {
              this.errorMessage = '⚠️ El token es inválido o ha expirado. Intenta de nuevo.';
              console.log('⚠️ Token inválido o expirado');
              this.router.navigate(['/register']); // 🚨 Redirige si el token no sirve
            }
          },
          error: (error) => {
            this.isLoading = false; // Desactivar el indicador de carga
            this.errorMessage = '❌ Ocurrió un error al verificar tu cuenta. Intenta de nuevo.';
            console.error("❌ Error al verificar:", error);
            this.router.navigate(['/register']);
          }
        });
      } else {
        console.error('⚠️ No se encontró el token en la URL');
        this.router.navigate(['/register']);
      }
    });
  }
}
