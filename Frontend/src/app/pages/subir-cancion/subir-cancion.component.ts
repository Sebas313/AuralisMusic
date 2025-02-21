import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../../services/song.service';


@Component({
  selector: 'app-subir-cancion',
  standalone: true,
  templateUrl: './subir-cancion.component.html',
  styleUrls: ['./subir-cancion.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ]
})
export class SubirCancionComponent implements OnInit {
  cancionForm: FormGroup;
  cargando: boolean = false;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private songService: SongService) {
    this.cancionForm = this.fb.group({
      cantante: ['', Validators.required],
      cancion: ['', Validators.required],
      album: ['', Validators.required],
      genero: ['', Validators.required],
      song: [null, Validators.required],  // Archivo de la canción
      image: [null] // Imagen opcional
    });
  }

  ngOnInit() {}

  /**
   * Maneja la selección de archivos y los asigna correctamente al formulario.
   */
  seleccionarArchivo(event: any, tipo: 'song' | 'image') {
    const file = event.target.files[0];
    if (file) {
      this.cancionForm.patchValue({ [tipo]: file });
      this.cancionForm.get(tipo)?.updateValueAndValidity();
      console.log(`📂 Archivo seleccionado (${tipo}):`, file.name);
    }
  }

  subirCancion() {
    if (this.cancionForm.invalid) {
      console.error("❌ Formulario inválido");
      return;
    }
  
    const formData = new FormData();
    formData.append("titulo", this.cancionForm.get("titulo")?.value);
    formData.append("album", this.cancionForm.get("album")?.value);
    formData.append("genero", this.cancionForm.get("genero")?.value);
    formData.append("cantante", this.cancionForm.get("cantante")?.value);
    
    if (this.cancionForm.get("song")?.value) {
      formData.append("song", this.cancionForm.get("song")?.value);
    }
    
    if (this.cancionForm.get("image")?.value) {
      formData.append("image", this.cancionForm.get("image")?.value);
    }
  
    this.songService.subirCancion(formData).subscribe({
      next: (res) => {
        console.log("✅ Canción subida con éxito", res);
      },
      error: (err) => {
        console.error("❌ Error al subir canción:", err);
      }
    });
  }
}  
