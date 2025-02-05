import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PlaylistComponent {
  playlists: any[] = [];
  newSong = { title: '', artist: '', url: '' };
  selectedPlaylist = '';

  // Usamos inject() en lugar del constructor
  private playlistService = inject(PlaylistService);

  ngOnInit() {
    this.playlists = this.playlistService.getPlaylists();
  }

  addSong() {
    if (this.selectedPlaylist && this.newSong.title && this.newSong.artist && this.newSong.url) {
      this.playlistService.addSongToPlaylist(this.selectedPlaylist, this.newSong);
      this.newSong = { title: '', artist: '', url: '' }; // Reseteamos el formulario
    }
  }
}
