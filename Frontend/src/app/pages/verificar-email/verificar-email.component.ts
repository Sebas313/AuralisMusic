import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
  
      if (token) {
        this.userService.verifyEmail(token).subscribe({
          next: (response) => {
            console.log('📥 Respuesta del backend:', response);
            if (response?.success && response?.token) {
              localStorage.setItem('authToken', response.token);
              this.router.navigate(['/home']); // ✅ Redirige al login
            } else {
              console.log('⚠️ Token inválido o expirado');
              this.router.navigate(['/register']); // 🚨 Redirige si el token no sirve
            }
          },
          error: (error) => {
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
