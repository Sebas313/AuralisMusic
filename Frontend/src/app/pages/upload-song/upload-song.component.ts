import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';   
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
})
export class UploadSongComponent {
  song = {
    title: '',
    file: null as File | null,
  };

  constructor(private songService: SongService) {}

  onFileChange(event: any) {
    this.song.file = event.target.files[0];
  }

  onSubmit() {
    if (this.song.title && this.song.file) {
      const formData = new FormData();
      formData.append('title', this.song.title);
      formData.append('file', this.song.file, this.song.file.name);

      this.songService.subirCancion(formData).subscribe({
        next: (response) => {
          alert('Canción subida con éxito');
        },
        error: (error) => {
          console.error('Error al subir la canción:', error);
          alert('Error al subir la canción. Intenta nuevamente.');
        },
      });
    }
  }
}
