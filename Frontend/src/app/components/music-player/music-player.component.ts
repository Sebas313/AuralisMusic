import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @Input() currentSong: any;
  @Input() isPlaying: boolean = false;

  currentTime: string = '00:00';
  totalTime: string = '03:00';
  audio!: HTMLAudioElement;
  
  // Lista de canciones (este es un ejemplo, puedes obtenerlas de un servicio o base de datos)
  songs = [
    { title: 'Hotline Bling', artist: 'Drake', image: 'assets/song1.jpg', audioUrl: 'assets/song1.mp3' },
    { title: 'Clocks', artist: 'Coldplay', image: 'assets/song2.jpg', audioUrl: 'assets/song2.mp3' },
    { title: 'Shape of You', artist: 'Ed Sheeran', image: 'assets/song3.jpg', audioUrl: 'assets/song3.mp3' }
  ];
  
  currentSongIndex: number = 0; // Índice de la canción actual en la lista

  ngOnInit() {
    if (this.songs.length > 0) {
      this.currentSong = this.songs[this.currentSongIndex]; // Inicializa la primera canción
      this.audio = new Audio(this.currentSong.audioUrl);
      this.audio.addEventListener('timeupdate', () => this.updateTime());
      this.audio.addEventListener('ended', () => this.nextSong());
      this.audio.volume = 0.5;
      if (this.isPlaying) {
        this.audio.play();
      }
    }
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('timeupdate', () => this.updateTime());
      this.audio.removeEventListener('ended', () => this.nextSong());
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  updateTime() {
    const currentSeconds = this.audio.currentTime;
    this.currentTime = this.formatTime(currentSeconds);
  }


  prevSong() {
    if (this.currentSongIndex > 0) {
      this.currentSongIndex--;
      this.currentSong = this.songs[this.currentSongIndex];
      this.playCurrentSong();
    }
  }

 
  nextSong() {
    if (this.currentSongIndex < this.songs.length - 1) {
      this.currentSongIndex++;
      this.currentSong = this.songs[this.currentSongIndex];
      this.playCurrentSong();
    }
  }

 
  playCurrentSong() {
    this.audio.pause(); 
    this.audio = new Audio(this.currentSong.audioUrl);
    this.audio.play(); 
    this.isPlaying = true;
    this.audio.addEventListener('timeupdate', () => this.updateTime());
    this.audio.addEventListener('ended', () => this.nextSong());
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  padZero(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
  }
}