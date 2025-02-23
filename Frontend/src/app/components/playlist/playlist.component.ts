import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../models/cancion.model';
@Component({
  selector: 'app-playlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'], // Corregido "styleUrls" en plural
  standalone: true
})

 export class PlaylistComponent implements OnInit {
    playlist: any[] = [];
    newSong = { title: '', artist: '', url: '' };
    selectedPlaylist = '';
    searchTerm: string = ''; // Agregamos esta lí

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
      this.playlist = data;
    });
  }

  get filteredPlaylists() {
    return this.playlist.filter(playlist =>
      playlist.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addSong() {
    if (this.selectedPlaylist && this.newSong.title && this.newSong.artist && this.newSong.url) {
      this.playlistService.addSongToPlaylist(this.selectedPlaylist, this.newSong).pipe(
        catchError(error => {
          console.error('Error al agregar canción:', error);
          return of(null); // Manejo del error sin romper la app
        })
      ).subscribe(() => {
        this.loadPlaylists(); // Actualizamos la lista de playlists
        this.newSong = { title: '', artist: '', url: '' };
      });
    
    
    
    
    }

  } removeFromPlaylist(cancion: Cancion) {
    this.playlist = this.playlist.filter(item => item._id !== cancion._id);
    console.log('Canción eliminada:', cancion);
  }
}


