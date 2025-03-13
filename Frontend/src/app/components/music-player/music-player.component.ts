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
      volume: this.volume, // Aplica el volumen actual
      onplay: () => {
        this.isPlaying = true;
        this.isPlayingChange.emit(this.isPlaying);
        this.trackProgress();
      },
      onend: () => {
        this.isPlaying = false;
        this.isPlayingChange.emit(this.isPlaying);
        clearInterval(this.interval);
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
        const randomSong = canciones[Math.floor(Math.random() * canciones.length)];
        this.songService.setCurrentSong(randomSong);
      }
    });
  }

  playRandom() {
    this.nextSong();
  }

  prevSong() {
    console.log('Función de canción anterior aún no implementada');
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

