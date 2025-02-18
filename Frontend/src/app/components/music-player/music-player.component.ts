import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Howl } from 'howler';

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
  @Input() playlist: any[] = [];

  currentTime: string = '00:00';
  totalTime: string = '00:00';
  currentSongIndex: number = 0;
  sound!: Howl;

  ngOnInit() {
    if (this.currentSong) {
      this.playCurrentSong();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSong'] && this.currentSong) {
      this.currentSongIndex = this.playlist.findIndex(song => song === this.currentSong);
      this.playCurrentSong();
    }
  }

  ngOnDestroy() {
    if (this.sound) {
      this.sound.stop();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.sound.pause();
    } else {
      this.sound.play();
    }
    this.isPlaying = !this.isPlaying;
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
    if (this.sound) {
      this.sound.stop();
    }
    
    this.sound = new Howl({
      src: [this.currentSong.audioUrl],
      html5: true,
      volume: 0.5,
      onend: () => this.nextSong()
    });
    
    this.sound.play();
    this.isPlaying = true;
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