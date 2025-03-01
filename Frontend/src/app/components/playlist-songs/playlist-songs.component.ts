import { ActivatedRoute } from '@angular/router';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-playlist-songs',
  templateUrl: './playlist-songs.component.html',
  styleUrls: ['./playlist-songs.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PlaylistSongsComponent implements OnInit {
  playlist: any = null;
  canciones: any[] = [];
  currentSong: any = null;
  isPlaying = false;
  audioPlayer = new Audio();

  @Output() songSelected = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.cargarPlaylist(playlistId);
    }
  }

  cargarPlaylist(id: string): void {
    this.playlistService.getPlaylist(id).subscribe({
      next: (data) => {
        console.log('📥 Respuesta de la API:', data);
  
        if (!data || typeof data !== 'object') {
          console.error('❌ Error: Datos de playlist inválidos');
          return;
        }
  
        this.playlist = data;
  
        if (Array.isArray(data.canciones) && data.canciones.length > 0) {
          if (typeof data.canciones[0] === 'string') {
            this.obtenerDetallesCanciones(data.canciones);
          } else {
            this.canciones = [...data.canciones];
          }
        } else {
          console.warn('⚠️ La playlist no tiene canciones.');
          this.canciones = [];
        }
      },
      error: (err) => console.error('❌ Error al cargar la playlist:', err)
    });
  }

  obtenerDetallesCanciones(cancionIds: string[]): void {
    if (!cancionIds.length) {
      console.warn('⚠️ No hay canciones para cargar.');
      return;
    }

    const requests = cancionIds.map(id => this.songService.getCancionById(id));

    forkJoin(requests).subscribe({
      next: (songsData) => {
        console.log('🎵 Canciones completas:', songsData);
        this.canciones = songsData;
      },
      error: (err) => console.error('❌ Error al obtener detalles de canciones:', err)
    });
  }

  playSong(song: any): void {
    if (!song?.fileUrl) {
      console.error('❌ La canción no tiene URL de audio');
      return;
    }

    if (this.currentSong && this.isPlaying) {
      this.stopCurrentSong();
    }

    this.currentSong = song;
    this.isPlaying = true;
    this.audioPlayer.src = song.fileUrl;
    this.audioPlayer.play();

    this.audioPlayer.onended = () => {
      this.isPlaying = false;
      this.currentSong = null;
    };

    this.songSelected.emit(song);
  }

  pauseSong(): void {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  stopCurrentSong(): void {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    this.isPlaying = false;
    this.currentSong = null;
  }
}
