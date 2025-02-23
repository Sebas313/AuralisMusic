import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Howl } from 'howler';
import { Subscription } from 'rxjs';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-music-player',
  standalone: true,
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @Input() currentSong: Cancion | null = null; // ✅ Ahora puede recibir el valor de HomeComponent
  @Input() isPlaying: boolean = false; // ✅ Ahora puede recibir el valor de HomeComponent
  @Input() playlist: Cancion[] = []; // ✅ Ahora puede recibir el valor de HomeComponent

  sound: Howl | null = null;
  songSubscription!: Subscription;
  playSubscription!: Subscription;
  duration: number = 0;
  currentTime: number = 0;
  interval: any;

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.songSubscription = this.songService.currentSong$.subscribe(song => {
      if (song && song !== this.currentSong) {
        this.currentSong = song;
        this.playCurrentSong();
      }
    });

    this.playSubscription = this.songService.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying;
      if (this.sound) {
        this.isPlaying ? this.sound.play() : this.sound.pause();
      }
    });
  }

  ngOnDestroy() {
    this.songSubscription.unsubscribe();
    this.playSubscription.unsubscribe();
    this.destroySound();
    clearInterval(this.interval);
  }

  playCurrentSong() {
    this.destroySound();
    if (!this.currentSong || !this.currentSong.fileUrl) {
      console.error('No se puede reproducir la canción. Falta el archivo de audio.');
      return;
    }

    this.sound = new Howl({
      src: [this.currentSong.fileUrl],
      html5: true,
      volume: 0.5,
      onplay: () => {
        this.duration = this.sound?.duration() || 0;
        this.trackProgress();
      },
      onend: () => {
        this.songService.setIsPlaying(false);
        clearInterval(this.interval);
      }
    });

    this.sound.play();
    this.songService.setIsPlaying(true);
  }

  togglePlay() {
    if (this.sound) {
      if (this.isPlaying) {
        this.sound.pause();
        clearInterval(this.interval);
      } else {
        this.sound.play();
        this.trackProgress();
      }
      this.songService.setIsPlaying(!this.isPlaying);
    }
  }

  private trackProgress() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.sound) {
        this.currentTime = this.sound.seek();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  prevSong() {
    this.songService.prevSong();
  }

  nextSong() {
    this.songService.nextSong();
  }

  playRandom() {
    this.songService.getCanciones().subscribe({
      next: (canciones) => {
        if (canciones.length === 0) {
          console.error('No hay canciones disponibles.');
          return;
        }
  
        const randomSong = canciones[Math.floor(Math.random() * canciones.length)];
        console.log('Canción aleatoria seleccionada:', randomSong);
  
        this.songService.setCurrentSong(randomSong); // Asegura que la canción seleccionada se actualiza
      },
      error: (err) => console.error('Error al obtener canciones:', err)
    });
  }
  

  private destroySound() {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    clearInterval(this.interval);
    this.currentTime = 0;
    this.duration = 0;
  }
}

