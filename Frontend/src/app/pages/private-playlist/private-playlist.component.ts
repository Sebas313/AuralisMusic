import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PlaylistUserComponent } from '../../components/playlist-user/playlist-user.component';


@Component({
  standalone: true,
  selector: 'app-private-playlist',
  templateUrl: './private-playlist.component.html',
  styleUrls: ['./private-playlist.component.css'],
  imports: [CommonModule, HeaderComponent, PlaylistUserComponent]
})
export class PrivatePlaylistComponent implements OnInit {
  playlist: any = null;
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
    
  
        if (!data || typeof data !== 'object') {
          console.error('❌ Error: Datos de playlist inválidos');
          return;
        }
  
        this.playlist = data;
        this.canciones = Array.isArray(data.canciones) ? data.canciones : [];
  
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
