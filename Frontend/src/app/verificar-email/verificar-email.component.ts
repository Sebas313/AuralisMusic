import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css']
})
export class VerificarEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // ✅ Captura el token desde la URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        // 🔄 Verifica el email con el token usando el microservicio
        this.userService.verifyEmail(token).subscribe({
          next: (response) => {
            if (response?.success && response?.token) {
              localStorage.setItem('authToken', response.token); // Guarda el token
              console.log('✅ Email verificado. Redirigiendo al home...');
              this.router.navigate(['/home']); // Redirige automáticamente al home
            } else {
              console.error('⚠️ Token inválido o expirado');
              this.router.navigate(['/register']); // Redirige si el token falla
            }
          },
          error: (error) => {
            console.error("❌ Error al verificar el email:", error);
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
