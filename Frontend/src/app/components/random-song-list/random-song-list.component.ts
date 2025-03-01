import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // ✅ Importamos SweetAlert2

@Component({
  selector: 'app-random-song-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './random-song-list.component.html',
  styleUrls: ['./random-song-list.component.css']
})
export class RandomSongListComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();
  currentSong: any = null;
  isPlaying = false;
  songs: any[] = [];
  audioPlayer = new Audio();
  playlists: any[] = []; 
  selectedSong: any = null;
  showModal = false;
  newPlaylistName = '';

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchSongs();
    this.fetchPlaylists();
  }

  fetchSongs() {
    this.songService.getCanciones().subscribe({
      next: (data) => {
        console.log("📥 Canciones recibidas:", data);
        this.songs = data.filter(song => song.fileUrl);
      },
      error: (err) => console.error('❌ Error al obtener canciones:', err)
    });
  }
  
  fetchPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data || [];
      },
      error: (err) => console.error('❌ Error al obtener playlists:', err)
    });
  }

  playSong(song: any) {
    if (!song.fileUrl) {
      console.error('❌ La canción no tiene URL de audio');
      return;
    }

    if (this.currentSong && this.isPlaying) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    this.currentSong = song;
    this.isPlaying = true;
    this.audioPlayer.src = song.fileUrl;
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
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Por favor, inicia sesión para agregar canciones a una playlist.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.selectedSong = song;
    this.showModal = true;
  }

  confirmAddToPlaylist(playlistId: string) {
    if (!playlistId) return;

    this.playlistService.addSongToPlaylist(playlistId, this.selectedSong).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '✅ Canción agregada',
          text: 'La canción se agregó con éxito a la playlist.',
          confirmButtonColor: '#3085d6'
        });
        this.closeModal();
      },
      error: (err) => console.error('❌ Error al agregar canción:', err)
    });
  }

  createNewPlaylist() {
    if (!this.newPlaylistName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ Nombre vacío',
        text: 'Debes escribir un nombre para la nueva playlist.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const newPlaylist = {
      nombre: this.newPlaylistName,
      creadoPor: user._id,
      canciones: [this.selectedSong._id]
    };

    this.playlistService.createPlaylist(newPlaylist).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '🎵 Playlist creada',
          text: 'La playlist se creó y la canción fue añadida.',
          confirmButtonColor: '#3085d6'
        });
        this.fetchPlaylists();
        this.closeModal();
      },
      error: (err) => console.error('❌ Error al crear la playlist:', err)
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedSong = null;
    this.newPlaylistName = '';
  }
}
