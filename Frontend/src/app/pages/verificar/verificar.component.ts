// verificar.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css']
})
export class VerificarComponent implements OnInit {
  loading: boolean = true; // Variable para manejar el estado de carga
  error: string | null = null; // Mensaje de error, si lo hay

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Obtener el token desde la URL
    const token = this.route.snapshot.paramMap.get('token');
    
    if (token) {
      // Verificar el token
      this.verificarEmail(token);
    } else {
      this.error = 'No se encontró un token en la URL.';
      this.loading = false;
    }
  }

  verificarEmail(token: string) {
    this.userService.verifyEmail(token).subscribe(
      (response) => {
        // Si la verificación fue exitosa, redirigir al login
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { verified: true } });
      },
      (error) => {
        // Si hay un error, mostrar el mensaje de error
        this.loading = false;
        this.error = 'Hubo un error al verificar tu correo. Por favor, inténtalo de nuevo.';
        console.error('Error al verificar el correo', error);
      }
    );
  }
}
