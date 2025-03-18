import { Component, Output, EventEmitter } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service'; 
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

  constructor(private playlistService: PlaylistService) {}  

  createPlaylist() {
    const userId = localStorage.getItem('userId');
    if (userId && this.newPlaylistName) {
      this.playlistService.createPlaylist({ userId, name: this.newPlaylistName }).subscribe({
        next: (response) => {
          this.playlistCreated.emit(response);
          this.newPlaylistName = '';
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
