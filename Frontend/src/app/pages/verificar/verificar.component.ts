import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verificar',
  template: '<p>Redirigiendo...</p>', // Pantalla de carga opcional
})
export class VerificarComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el token desde los queryParams
    this.route.queryParams.subscribe(params => {
      const token = params['token']; // 🔍 Aquí tomamos el token correctamente

      if (token) {
        console.log('🔑 Redirigiendo con el token:', token);
        // Redirigir a verificar-email con el token en los queryParams
        this.router.navigate(['/verificar-email'], { queryParams: { token } });
      } else {
        console.warn('⚠️ No se encontró el token en la URL.');
      }
    });
  }
}
