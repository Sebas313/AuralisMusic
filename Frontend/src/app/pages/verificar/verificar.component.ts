
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css']
})
export class VerificarComponent implements OnInit {
  loading: boolean = true; 
  error: string | null = null; 

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {

    const token = this.route.snapshot.paramMap.get('token');
    
    if (token) {
    
      this.verificarEmail(token);
    } else {
      this.error = 'No se encontró un token en la URL.';
      this.loading = false;
    }
  }

  verificarEmail(token: string) {
    this.userService.verifyEmail(token).subscribe(
      (response) => {
    
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { verified: true } });
      },
      (error) => {
       
        this.loading = false;
        this.error = 'Hubo un error al verificar tu correo. Por favor, inténtalo de nuevo.';
        console.error('Error al verificar el correo', error);
      }
    );
  }
}
