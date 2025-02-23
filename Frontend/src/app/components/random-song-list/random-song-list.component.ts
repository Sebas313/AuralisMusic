import { Component, EventEmitter, Output, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import WaveSurfer from 'wavesurfer.js';
import { MusicPlayerComponent } from '../music-player/music-player.component';

@Component({
  selector: 'app-random-song-list',
  standalone: true,
  imports: [CommonModule, MusicPlayerComponent],
  templateUrl: './random-song-list.component.html',
  styleUrls: ['./random-song-list.component.css']
})
export class RandomSongListComponent implements OnInit, AfterViewInit {
  @Output() songSelected = new EventEmitter<any>();
  @ViewChild('waveform') waveformRef!: ElementRef;

  currentSong: any = null;
  isPlaying = false;
  songs: any[] = [];
  playlist: any[] = []; // ✅ Se inicializa vacío
  wavesurfer!: WaveSurfer;

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchSongs();
  }

  ngAfterViewInit() {
    if (!this.waveformRef || !this.waveformRef.nativeElement) {
      console.error('❌ No se encontró el elemento waveform.');
      return;
    }

    // ✅ Inicializar WaveSurfer una sola vez
    this.wavesurfer = WaveSurfer.create({
      container: this.waveformRef.nativeElement,
      waveColor: 'lightblue',
      progressColor: 'blue',
      barWidth: 2,
      height: 60
    });

    this.cdr.detectChanges();
  }

  fetchSongs() {
    this.songService.getCanciones().subscribe({
      next: (data) => {
        this.songs = data.filter(song => song.fileUrl);
      },
      error: (err) => console.error('Error al obtener canciones:', err)
    });
  }

  get showMusicPlayer() {
    return !!this.currentSong; // ✅ Se muestra solo cuando hay una canción
  }

  playSong(song: any) {
    if (!song.fileUrl) {
      console.error('❌ La canción no tiene URL de audio.');
      return;
    }

    // 🛠️ Construcción segura de la URL del audio
    const cleanedFileUrl = song.fileUrl.replace(/^\/?uploads\//, '');
    const audioUrl = `http://localhost:3000/public/uploads/${cleanedFileUrl}`;

    console.log('🎵 Reproduciendo:', audioUrl);

    if (!this.waveformRef || !this.waveformRef.nativeElement) {
      console.error('❌ waveformRef no está definido.');
      return;
    }

    // ✅ Si ya hay una canción sonando, detenerla antes de cambiar
    if (this.wavesurfer) {
      this.wavesurfer.stop();
      this.wavesurfer.empty(); // Vaciar la forma de onda antes de cargar la nueva
    }

    // ⚡ Cargar y reproducir la nueva canción
    this.wavesurfer.load(audioUrl);
    this.wavesurfer.on('ready', () => {
      this.wavesurfer.play();
      this.isPlaying = true;
      this.currentSong = song;
      this.songSelected.emit(song);
    });

    this.wavesurfer.on('finish', () => {
      this.isPlaying = false;
    });

    this.wavesurfer.on('error', (err) => {
      console.error('❌ Error al reproducir la canción:', err);
    });
  }

  pauseSong() {
    if (this.wavesurfer && this.isPlaying) {
      this.wavesurfer.pause();
      this.isPlaying = false;
    }
  }

  stopCurrentSong() {
    if (this.wavesurfer) {
      this.wavesurfer.stop();
      this.wavesurfer.empty();
    }
    this.isPlaying = false;
    this.currentSong = null;
  }

  playRandomSong() {
    this.stopCurrentSong();

    if (this.songs.length === 0) {
      console.error('No hay canciones disponibles.');
      return;
    }

    const randomSong = this.songs[Math.floor(Math.random() * this.songs.length)];
    this.playSong(randomSong);
  }

 


  addToPlaylist(song: any) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !user._id) {
      alert('Por favor, inicie sesión para agregar canciones a una playlist.');
      return;
    }

    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => {
        if (playlists.length > 0) {
          const playlistName = prompt('¿A qué playlist deseas agregar esta canción?');
          const selectedPlaylist = playlists.find(playlist => playlist.name === playlistName);

          if (selectedPlaylist) {
            this.playlistService.addSongToPlaylist(selectedPlaylist.id, song).subscribe({
              next: () => alert('🎵 Canción agregada con éxito a la playlist'),
              error: (err) => console.error('❌ Error al agregar canción:', err)
            });
          } else {
            alert('⚠️ No encontré esa playlist.');
          }
        } else {
          const createNewPlaylist = confirm('No tienes playlists. ¿Quieres crear una nueva?');
          if (createNewPlaylist) {
            const newPlaylistName = prompt('Escribe el nombre de la nueva playlist');
            if (newPlaylistName) {
              const newPlaylist = {
                nombre: newPlaylistName,
                creadoPor: user._id,
                canciones: [song._id]
              };
              this.playlistService.createPlaylist(newPlaylist).subscribe({
                next: () => alert('✅ Playlist creada con éxito y canción añadida'),
                error: (err) => console.error('❌ Error al crear la playlist:', err)
              });
            } else {
              alert('⚠️ Debes proporcionar un nombre para la playlist.');
            }
          }
        }
      },
      error: (err) => console.error('❌ Error al obtener playlists:', err)
    });
  }
}
