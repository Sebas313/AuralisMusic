import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PlaylistComponent implements OnInit {
  playlists: any[] = [];
  newSong = { title: '', artist: '', url: '' };
  selectedPlaylist = '';

  private playlistService = inject(PlaylistService);

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().pipe(
      catchError(error => {
        console.error('Error al cargar playlists:', error);
        return of([]); // Devuelve un array vacío si hay error
      })
    ).subscribe((data) => {
      this.playlists = data;
    });
  }

  addSong() {
    if (this.selectedPlaylist && this.newSong.title && this.newSong.artist && this.newSong.url) {
      this.playlistService.addSongToPlaylist(this.selectedPlaylist, this.newSong).pipe(
        catchError(error => {
          console.error('Error al agregar canción:', error);
          return of(null); // Manejar el error sin romper la app
        })
      ).subscribe(() => {
        this.loadPlaylists(); // Actualizamos la lista de playlists
        this.newSong = { title: '', artist: '', url: '' };
      });
    }
  }
}
