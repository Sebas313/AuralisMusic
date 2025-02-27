import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-private-playlist',
  templateUrl: './private-playlist.component.html',
  styleUrls: ['./private-playlist.component.css'],
  imports: [CommonModule]
})
export class PrivatePlaylistComponent implements OnInit {
  playlist: any = null;
  canciones: any[] = [];
  currentSong: any = null;
  isPlaying = false;
  audioPlayer = new Audio();

  @Output() songSelected = new EventEmitter<any>();
songs: any;

  constructor(
    private route: ActivatedRoute, // ✅ Obtener el ID desde la URL
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id'); // ✅ Obtener ID
    if (playlistId) {
      this.cargarPlaylist(playlistId);
    }
  }

  cargarPlaylist(id: string) {
    this.playlistService.getPlaylist(id).subscribe({
      next: (data) => {
        console.log('📥 Respuesta de la API:', data); // 🛠 Verifica qué llega realmente
  
        if (!data || typeof data !== 'object') {
          console.error('❌ Error: Datos de playlist inválidos');
          return;
        }
  
        this.playlist = data;
        this.canciones = Array.isArray(data.canciones) ? data.canciones : [];
  
        console.log('🎵 Canciones cargadas:', this.canciones); // 🔍 Verifica si se están asignando
      },
      error: (err) => console.error('❌ Error al cargar la playlist:', err)
    });
  }

  playSong(song: any) {
    if (!song || !song.fileUrl) {
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
}
