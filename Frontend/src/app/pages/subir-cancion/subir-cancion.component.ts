import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-subir-cancion',
  standalone: true,
  templateUrl: './subir-cancion.component.html',
  styleUrls: ['./subir-cancion.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, HeaderComponent]
})
export class SubirCancionComponent {
  cancionForm: FormGroup;
  cargando: boolean = false;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.cancionForm = this.fb.group({
      cantante: ['', Validators.required],
      cancion: ['', Validators.required],
      album: ['', Validators.required],
      genero: ['', Validators.required],
      song: [null, Validators.required],
      image: [null]
    });
  }

  seleccionarArchivo(event: any, tipo: string) {
    const file = event.target.files[0];
    if (file) {
      this.cancionForm.patchValue({ [tipo]: file });
      this.cancionForm.get(tipo)?.updateValueAndValidity(); // Validar campo actualizado
    }
  }

  subirCancion() {
    if (this.cancionForm.invalid) {
      this.mensaje = "Completa todos los campos obligatorios.";
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const formData = new FormData();
    Object.entries(this.cancionForm.value).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value) {
        formData.append(key, value.toString());
      }
    });

    this.http.post('http://localhost:3000/api/canciones', formData).subscribe({
      next: () => {
        this.mensaje = "Canción subida con éxito.";
        this.cancionForm.reset();
      },
      error: () => {
        this.mensaje = "Error al subir la canción.";
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
