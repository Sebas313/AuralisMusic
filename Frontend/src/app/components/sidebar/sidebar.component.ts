import { Component, EventEmitter, Output, HostListener, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import WaveSurfer from 'wavesurfer.js';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() songSelected = new EventEmitter<any>();
  @ViewChild('waveform', { static: false }) waveformRef!: ElementRef;

  isExpanded = false;
  isSearchVisible = false;
  searchQuery = '';
  currentSong: any = null;
  isPlaying = false;
  playlist: any[] = [];
  songs: any[] = [];
  filteredSongs: any[] = [];
  wavesurfer: WaveSurfer | null = null;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.getSongs();
  }

  ngOnDestroy() {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  getSongs(): void {
    this.songService.getCanciones().subscribe(
      data => {
        console.log('Canciones obtenidas:', data);
        this.songs = data;
        this.filteredSongs = [...this.songs];
      },
      error => {
        console.error('Error al obtener canciones:', error);
      }
    );
  }

  filterSongs(): void {
    const searchTermLower = this.searchQuery.toLowerCase().trim();
    
    if (!searchTermLower) {
      this.filteredSongs = [...this.songs];
    } else {
      this.filteredSongs = this.songs.filter(song =>
        song.cancion?.toLowerCase().includes(searchTermLower) || 
        song.album?.toLowerCase().includes(searchTermLower)
      );
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchQuery = '';
      this.filteredSongs = [...this.songs];
    }
  }

  addToPlaylist(song: any) {
    if (!this.playlist.includes(song)) {
      this.playlist.push(song);
    }
  }

  playSong(song: any) {
    if (!song.fileUrl) {
      return;
    }

    if (!this.waveformRef?.nativeElement) {
      return;
    }

    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }

    this.wavesurfer = WaveSurfer.create({
      container: this.waveformRef.nativeElement,
      waveColor: 'lightblue',
      progressColor: 'blue',
      barWidth: 2,
      height: 60
    });

    const audioUrl = song.fileUrl.startsWith('http') ? song.fileUrl : `http://localhost:3000/public/${song.fileUrl.replace(/^\/+/, '')}`;
    this.wavesurfer.load(audioUrl);
    this.wavesurfer.play();

    this.songSelected.emit(song);

    this.wavesurfer.on('finish', () => {
      this.isPlaying = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const searchBar = document.querySelector('.search-bar');
    const songList = document.querySelector('.song-list');

    if (
      sidebar && !sidebar.contains(event.target as Node) &&
      searchBar && !searchBar.contains(event.target as Node) &&
      songList && !songList.contains(event.target as Node)
    ) {
      this.isSearchVisible = false;
    }
  }
}
