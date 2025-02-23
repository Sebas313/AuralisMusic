import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { HttpClientModule } from '@angular/common/http';

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
  songs: any[] = [];
  audioPlayer = new Audio();

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getCanciones().subscribe({
      next: (data) => {
        this.songs = data.filter(song => song.fileUrl);
      },
      error: (err) => console.error('❌ Error al obtener canciones:', err)
    });
  }

  playSong(song: any) {
    if (!song.fileUrl) {
      console.error('❌ La canción no tiene URL de audio');
      return;
    }

    const audioUrl = song.fileUrl.startsWith('http') ? song.fileUrl : `http://localhost:3000/public/${song.fileUrl.replace(/^\/+/, '')}`;

    // Si hay una canción reproduciéndose, la detenemos antes de cambiar
    if (this.currentSong && this.isPlaying) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    this.currentSong = song;
    this.isPlaying = true;
    this.audioPlayer.src = audioUrl;
    this.audioPlayer.play();

    this.audioPlayer.onended = () => {
      this.isPlaying = false;
    };

    this.songSelected.emit(song);
  }

  pauseSong() {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  stopCurrentSong() {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    this.isPlaying = false;
    this.currentSong = null;
  }

  addToPlaylist(song: any) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user._id) {
      alert('⚠️ Por favor, inicie sesión para agregar canciones a una playlist.');
      return;
    }

    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        if (playlists.length > 0) {
          const playlistName = prompt('🎶 ¿A qué playlist deseas agregar esta canción?');
          const selectedPlaylist = playlists.find(playlist => playlist.name === playlistName);

          if (selectedPlaylist) {
            this.playlistService.addSongToPlaylist(selectedPlaylist._id, song).subscribe({
              next: () => alert('✅ Canción agregada con éxito a la playlist'),
              error: (err) => console.error('❌ Error al agregar canción:', err)
            });
          } else {
            alert('⚠️ No encontré esa playlist.');
          }
        } else {
          const createNewPlaylist = confirm('No tienes playlists. ¿Quieres crear una nueva?');
          if (createNewPlaylist) {
            const newPlaylistName = prompt('🆕 Escribe el nombre de la nueva playlist');
            if (newPlaylistName) {
              const newPlaylist = {
                nombre: newPlaylistName,
                creadoPor: user._id,
                canciones: [song._id]
              };
              this.playlistService.createPlaylist(newPlaylist).subscribe({
                next: () => alert('✅ Playlist creada con éxito y canción añadida'),
                error: (err) => console.error('❌ Error al crear la playlist:', err)
              });
            } else {
              alert('⚠️ Debes proporcionar un nombre para la playlist.');
            }
          }
        }
      },
      error: (err) => console.error('❌ Error al obtener playlists:', err)
    });
  }
}
