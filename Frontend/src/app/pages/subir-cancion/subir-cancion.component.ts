import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../../services/song.service';
import { HeaderComponent } from "../../components/header/header.component";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subir-cancion',
  standalone: true,
  templateUrl: './subir-cancion.component.html',
  styleUrls: ['./subir-cancion.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent]
})
export class SubirCancionComponent implements OnInit {
  cancionForm: FormGroup;
  cargando: boolean = false;
  mensaje: string = '';
  archivoCancion: File | null = null;  
  archivoImagen: File | null = null; 

  constructor(private fb: FormBuilder, private songService: SongService, private router: Router) {
    this.cancionForm = this.fb.group({
      cantante: ['', Validators.required],
      cancion: ['', Validators.required],
      album: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  ngOnInit() {}

 
  seleccionarArchivo(event: any, tipo: 'song' | 'image') {
    const file = event.target.files[0];

    if (!file) return;

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
      this.mensaje = `El archivo ${file.name} es demasiado grande.`;
      return;
    }

    if (tipo === 'song' && !file.type.startsWith('audio/')) {
      this.mensaje = 'El archivo seleccionado no es un audio válido.';
      return;
    }

    if (tipo === 'image' && !file.type.startsWith('image/')) {
      this.mensaje = 'El archivo seleccionado no es una imagen válida.';
      return;
    }

    if (tipo === 'song') {
      this.archivoCancion = file;
    } else if (tipo === 'image') {
      this.archivoImagen = file;
    }

    console.log(`📂 Archivo seleccionado (${tipo}):`, file.name);
  }
  subirCancion() {
    if (this.cancionForm.invalid || !this.archivoCancion) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos y seleccione una canción.',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("cantante", this.cancionForm.get("cantante")?.value);
    formData.append("cancion", this.cancionForm.get("cancion")?.value);
    formData.append("album", this.cancionForm.get("album")?.value);
    formData.append("genero", this.cancionForm.get("genero")?.value);
    formData.append("song", this.archivoCancion!);
  
    if (this.archivoImagen) {
      formData.append("imageCover", this.archivoImagen);
    }
  
    this.cargando = true;
  
    this.songService.subirCancion(formData).subscribe({
      next: (res) => {
        console.log("✅ Respuesta del backend:", res);
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La canción se ha subido correctamente.',
          confirmButtonText: 'Ir a la Home'
        }).then(() => {
          this.router.navigate(['/home']);
        });
  
        this.cancionForm.reset();
        this.archivoCancion = null;
        this.archivoImagen = null;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error en la subida:', err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al subir la canción. Intente nuevamente.',
        });
  
        this.cargando = false;
      },
    });
  }
  
  
  
}
