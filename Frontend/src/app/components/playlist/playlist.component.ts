import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../models/cancion.model';
import { Router } from '@angular/router';
import { SongService } from '../../services/song.service'; 
@Component({
  selector: 'app-playlist',
  imports: [CommonModule, FormsModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  standalone: true
})
export class PlaylistComponent implements OnInit {
  playlists: any[] = []; 
  selectedPlaylist: any = null;
  newSong = { title: '', artist: '', url: '', _id: '' }; 
  searchTerm: string = '';
  selectedSongs: any[] = []; 

  private playlistService = inject(PlaylistService);
  constructor(private router: Router, private songService: SongService) {}


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
      this.playlists = data || [];
    });
  }

  get filteredPlaylists() {
    return this.playlists.filter(playlist =>
      playlist.nombre?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToPlaylist(playlistId: string) {
    this.selectedPlaylist = this.playlists.find(p => p._id === playlistId);
    if (this.selectedPlaylist) {
      this.router.navigate(['/playlist', playlistId]);
    }
  }


  addSong() {
    if (this.selectedPlaylist && this.newSong.title && this.newSong.artist && this.newSong.url) {
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


  
}
