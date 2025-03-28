import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-verificacion-exitosa',
  templateUrl: './verificacion-exitosa.component.html',
  styleUrls: ['./verificacion-exitosa.component.css']
})
export class VerificacionExitosaComponent implements OnInit { 

  token: string;

  constructor(private route: ActivatedRoute, private router: Router) {} 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const verified = params['verified'];
      if (verified === 'true') {
  
        this.router.navigate(['/login']);
      }
    });
  }
}
