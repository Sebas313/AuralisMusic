import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Howl, Howler } from 'howler';
import { Subscription } from 'rxjs';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-music-player',
  standalone: true,
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @Input() currentSong: Cancion | null = null;
  @Input() isPlaying: boolean = false;
  @Output() isPlayingChange = new EventEmitter<boolean>();

  private sound: Howl | null = null;
  private songSubscription!: Subscription;
  private interval: any;
  private history: Cancion[] = []; // Historial de canciones
  private currentSongIndex: number = -1;
  volume: number = 0.5; // Volumen inicial (50%)
  currentTime: number = 0;
  duration: number = 0;

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.songSubscription = this.songService.currentSong$.subscribe(song => {
      if (song) {
        this.destroySound();
        this.currentSong = song;
        this.playCurrentSong();
      }
    });
  }

  ngOnDestroy() {
    this.songSubscription.unsubscribe();
    this.destroySound();
    clearInterval(this.interval);
  }

  private playCurrentSong() {
    if (!this.currentSong?.fileUrl) return;
  
    this.sound = new Howl({
      src: [this.currentSong.fileUrl],
      html5: true,
      volume: this.volume,
      onplay: () => {
        this.isPlaying = true;
        this.isPlayingChange.emit(this.isPlaying);
        this.trackProgress();
      },
      onend: () => {
        this.nextSong(); // 🔥 Asegura que llame a nextSong()
      }
    });
  
    this.sound.play();
  }
  

  togglePlay() {
    if (!this.sound) return;
    
    if (this.sound.playing()) {
      this.sound.pause();
      this.isPlaying = false;
    } else {
      this.sound.play();
      this.isPlaying = true;
      this.trackProgress();
    }

    this.isPlayingChange.emit(this.isPlaying);
    this.songService.setIsPlaying(this.isPlaying);
  }

  adjustVolume() {
    Howler.volume(this.volume); // Ajusta el volumen globalmente
  }

  private trackProgress() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.sound?.playing()) {
        this.currentTime = this.sound.seek() as number;
        this.duration = this.sound.duration() as number;
      }
    }, 1000);
  }
  
  // Permitir al usuario adelantar/retroceder la canción manualmente
  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    const seekTime = parseFloat(input.value);
    if (this.sound) {
      this.sound.seek(seekTime);
      this.currentTime = seekTime;
    }
  }
  
  nextSong() {
    this.destroySound();
    this.songService.getCanciones().pipe(take(1)).subscribe(canciones => {
      if (canciones.length) {
        let randomSong;
  
        // Evitar repetir la misma canción inmediatamente
        do {
          randomSong = canciones[Math.floor(Math.random() * canciones.length)];
        } while (this.currentSong && randomSong._id === this.currentSong._id);
  
        // Guardar la canción actual en el historial antes de cambiar
        if (this.currentSong) {
          this.history.push(this.currentSong);
          this.currentSongIndex = this.history.length - 1;
        }
  
        this.currentSong = randomSong;
        this.songService.setCurrentSong(randomSong);
        this.playCurrentSong();
      }
    });
  }
  
  

  playRandom() {
    this.nextSong();
  }

  prevSong() {
    if (this.history.length > 0 && this.currentSongIndex >= 0) {
      this.destroySound();

      // Obtener la canción anterior del historial
      this.currentSong = this.history[this.currentSongIndex];
      // Ajustar el índice para seguir retrocediendo si es necesario
      this.currentSongIndex = Math.max(this.currentSongIndex - 1, 0);

      this.songService.setCurrentSong(this.currentSong);
      this.playCurrentSong();
    } else {}
  }

  private destroySound() {
    if (this.sound) {
      if (this.sound.playing()) this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    Howler.stop();
    clearInterval(this.interval);
  }

  formatTime(time: number): string {
    if (isNaN(time) || time < 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}

