import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrección: "styleUrl" → "styleUrls"
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  constructor(private router: Router) {}

ngOnInit() {}
}
