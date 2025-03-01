import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';

import { PlaylistSongsComponent } from '../../components/playlist-songs/playlist-songs.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';

@Component({
  selector: 'app-playlist-user',
  templateUrl: './playlist-user.component.html',
  styleUrls: ['./playlist-user.component.css'],
  standalone: true,
  imports: [CommonModule, PlaylistSongsComponent, MusicPlayerComponent]
})
export class PlaylistUserComponent {
  @Input() playlist: any = null; 



  canciones: any[] = [];
  currentSong: any = null;
  isPlaying = false;
  audioPlayer = new Audio();
  showMusicPlayer = false;

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

  cargarPlaylist(id: string) {
    this.playlistService.getPlaylist(id).subscribe({
      next: (data) => {
        console.log('📥 Respuesta de la API:', data);

        if (!data || typeof data !== 'object') {
          console.error('❌ Error: Datos de playlist inválidos');
          return;
        }

        this.playlist = data;
        this.canciones = Array.isArray(data.canciones) ? data.canciones : [];

        console.log('🎵 Canciones cargadas:', this.canciones);
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
    this.showMusicPlayer = true;

    console.log('🎶 Reproduciendo:', this.currentSong);
    console.log('🎵 Mostrando MusicPlayer:', this.showMusicPlayer);

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
    this.showMusicPlayer = false;
  }
}
