import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() songSelected = new EventEmitter<any>();  // Emitir la canción seleccionada

  isExpanded = false;
  isSearchVisible = false;
  searchQuery = '';
  currentSong: any = null;
  isPlaying = false;
  playlist: any[] = [];
  // Lista de canciones de ejemplo
  songs = [
    { title: 'Hotline Bling', artist: 'Billie Eilish', image: 'assets/song1.jpg', audioUrl: 'assets/song1.mp3' },
    { title: 'Anrretor', artist: 'Yann Tiersen', image: 'assets/song2.jpg', audioUrl: 'assets/song2.mp3' },
    { title: 'Back To Her Men', artist: 'Damian Rice', image: 'assets/song3.jpg', audioUrl: 'assets/song3.mp3' }
  ];

  filteredSongs = [...this.songs];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  filterSongs() {
    if (this.searchQuery.trim()) {
      this.filteredSongs = this.songs.filter(song =>
        song.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredSongs = [...this.songs];
    }
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
      this.playlist.push(song);  // Solo agregar si no está ya en la playlist
    }
  }
  playSong(song: any) {
    this.songSelected.emit(song);  // Emitir la canción seleccionada
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const searchBar = document.querySelector('.search-bar');
    const songList = document.querySelector('.song-list');

    // Si el clic es fuera del sidebar, la barra de búsqueda y la lista de canciones, cerrar la búsqueda
    if (sidebar && !sidebar.contains(event.target as Node) && searchBar && !searchBar.contains(event.target as Node) && songList && !songList.contains(event.target as Node)) {
      this.isSearchVisible = false;
    }
  }
}
