import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-random-song-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './random-song-list.component.html',
  styleUrls: ['./random-song-list.component.css']
})
export class RandomSongListComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  currentSong: any = null;
  isPlaying = false;
  playlist: any[] = [];
  songs: any[] = [];

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getSongs().subscribe({
      next: (data) => {
        this.songs = data;
      },
      error: (err) => {
        console.error('Error al obtener canciones:', err);
      }
    });
  }

  addToPlaylist(song: any) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Por favor, inicie sesión para agregar canciones a una playlist.');
      return;
    }
  
    // Obtener las playlists del usuario o crear una nueva
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        if (playlists.length > 0) {
          // Si el usuario tiene playlists, agregar la canción a la seleccionada
          const playlistName = prompt('¿A qué playlist deseas agregar esta canción?');
          const selectedPlaylist = playlists.find(
            (playlist) => playlist.name === playlistName
          );
          if (selectedPlaylist) {
            this.playlistService.addSongToPlaylist(selectedPlaylist.name, song).subscribe({
              next: (response) => {
                alert('Canción agregada con éxito a la playlist');
              },
              error: (err) => {
                console.error('Error al agregar canción:', err);
              }
            });
          } else {
            alert('No encontré esa playlist.');
          }
        } else {
          // Si no tiene playlists, preguntar si quiere crear una nueva
          const createNewPlaylist = confirm('No tienes playlists. ¿Quieres crear una nueva?');
          if (createNewPlaylist) {
            const newPlaylistName = prompt('Escribe el nombre de la nueva playlist');
            if (newPlaylistName) {
              // Crear una nueva playlist
              this.playlistService.createPlaylist({ name: newPlaylistName }).subscribe({
                next: (newPlaylist) => {
                  alert('Playlist creada con éxito');
                  // Después de crear la playlist, agregar la canción a esa nueva playlist
                  this.playlistService.addSongToPlaylist(newPlaylist.name, song).subscribe({
                    next: (response) => {
                      alert('Canción agregada con éxito a la nueva playlist');
                    },
                    error: (err) => {
                      console.error('Error al agregar canción:', err);
                    }
                  });
                },
                error: (err) => {
                  console.error('Error al crear la playlist:', err);
                }
              });
            } else {
              alert('Debes proporcionar un nombre para la playlist.');
            }
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener playlists:', err);
      }
    });
  }
  

  playSong(song: any) {
    this.currentSong = song;
    this.isPlaying = true;
    this.songSelected.emit(song);
  }
}
