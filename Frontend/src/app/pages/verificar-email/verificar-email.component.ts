import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css']
})
export class VerificarEmailComponent implements OnInit {
  
  isLoading: boolean = false; 
  errorMessage: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
  
      if (token) {
        this.isLoading = true; 
        
        this.userService.verifyEmail(token).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response?.success && response?.token) {
              localStorage.setItem('authToken', response.token);
              this.router.navigate(['/login']); 
            } else {
              this.errorMessage = '⚠️ El token es inválido o ha expirado. Intenta de nuevo.';
              this.router.navigate(['/register']); 
            }
          },
          error: (error) => {
            this.isLoading = false; 
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
