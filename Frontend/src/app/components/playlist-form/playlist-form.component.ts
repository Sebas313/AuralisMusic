import { Component, Output, EventEmitter } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';  // Cambia a PlaylistService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PlaylistFormComponent {
  newPlaylistName: string = '';

  @Output() playlistCreated = new EventEmitter<any>();

  constructor(private playlistService: PlaylistService) {}  // Cambia a PlaylistService

  createPlaylist() {
    const userId = localStorage.getItem('userId');
    if (userId && this.newPlaylistName) {
      this.playlistService.createPlaylist({ userId, name: this.newPlaylistName }).subscribe({
        next: (response) => {
          this.playlistCreated.emit(response);  // Emitir el evento con la nueva playlist
          this.newPlaylistName = '';  // Resetear el campo
          alert('Playlist creada con éxito');
        },
        error: (err) => {
          console.error('Error al crear la playlist:', err);
        }
      });
    } else {
      console.error('Faltan datos');
    }
  }
}
