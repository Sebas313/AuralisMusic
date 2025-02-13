import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentSong: any;
  @Input() isPlaying: boolean = false;
  @Input() playlist: any[] = [];  // Ahora recibe la playlist

  currentTime: string = '00:00';
  totalTime: string = '00:00';
  audio!: HTMLAudioElement;
  currentSongIndex: number = 0;

  ngOnInit() {
    this.audio = new Audio();
    this.audio.addEventListener('timeupdate', () => this.updateTime());
    this.audio.addEventListener('ended', () => this.nextSong());
    this.audio.volume = 0.5;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSong'] && this.currentSong) {
      this.currentSongIndex = this.playlist.findIndex(song => song === this.currentSong);
      this.playCurrentSong();
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

  nextSong() {
    if (this.playlist.length > 0) {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
      this.currentSong = this.playlist[this.currentSongIndex];
      this.playCurrentSong();
    }
  }

  prevSong() {
    if (this.playlist.length > 0) {
      this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
      this.currentSong = this.playlist[this.currentSongIndex];
      this.playCurrentSong();
    }
  }

  playCurrentSong() {
    if (this.audio) {
      this.audio.pause();
    }
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
