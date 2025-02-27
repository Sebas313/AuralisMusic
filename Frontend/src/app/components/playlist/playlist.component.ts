import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../models/cancion.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  standalone: true
})
export class PlaylistComponent implements OnInit {
  playlist: any[] = [];
  selectedPlaylist: any = null;
  newSong = { title: '', artist: '', url: '', _id: '' }; // Añadido _id para compatibilidad
  searchTerm: string = '';

  constructor(private router: Router) {}

  private playlistService = inject(PlaylistService);

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.playlistService.getPlaylists().pipe(
      catchError(error => {
        console.error('Error al cargar playlists:', error);
        return of([]);
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

  goToPlaylist(playlistId: string) {
    this.selectedPlaylist = this.playlist.find(p => p._id === playlistId);
    this.router.navigate(['/playlist', playlistId]);
  }

  addSong() {
    if (this.selectedPlaylist && this.newSong.title && this.newSong.artist && this.newSong.url) {
      // Aquí deberías primero crear la canción y obtener su ID
      // Por ahora, asumimos que ya tienes el ID o que tu API puede manejar
      // la creación de la canción junto con agregarla a la playlist
      
      this.playlistService.addSongToPlaylist(this.selectedPlaylist._id, this.newSong).pipe(
        catchError(error => {
          console.error('Error al agregar canción:', error);
          return of(null);
        })
      ).subscribe(() => {
        this.loadPlaylists();
        this.newSong = { title: '', artist: '', url: '', _id: '' };
      });
    }
  }

  removeFromPlaylist(cancion: Cancion) {
    if (this.selectedPlaylist) {
      this.selectedPlaylist.songs = this.selectedPlaylist.songs.filter(s => s._id !== cancion._id);
      console.log('Canción eliminada:', cancion);
    }
  }
}