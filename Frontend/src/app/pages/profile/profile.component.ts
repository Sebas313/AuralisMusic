import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, HeaderComponent, PlaylistComponent ],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  playlist: any = null;
  canciones: any[] = [];
  defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.fetchUserProfile();
  }
  esCantante(): boolean {
    return this.user?.rol === "cantante";
  }

  fetchUserProfile() {
    if (!this.user?._id) {
      console.error('❌ No se encontró _id en el usuario almacenado');
      return;
    }
  
    this.userService.fetchUserProfile(this.user._id).subscribe({
      next: (response) => {
  
        if (!response) {
          console.error('❌ Respuesta vacía del servidor');
          return;
        }
  
        this.user = response;
        localStorage.setItem('user', JSON.stringify(this.user));
  
        if (!response.playlists || !Array.isArray(response.playlists)) {
          console.warn('⚠️ No hay playlists asociadas al usuario');
          return;
        }
  
        this.cargarPlaylists(response.playlists);
      },
      error: (err) => console.error('❌ Error en la petición:', err)
    });
  }
  
  
  

  cargarPlaylists(playlistIds: any[]) {
    if (!playlistIds || playlistIds.length === 0) {
      console.warn('⚠️ No hay playlists asociadas al usuario.');
      this.playlist = [];
      return;
    }
  
    const validIds = playlistIds
      .map((playlist) => (typeof playlist === 'string' ? playlist : playlist?._id))
      .filter((id) => id);
  
    if (validIds.length === 0) {
      console.warn('⚠️ No hay IDs de playlists válidos.');
      this.playlist = [];
      return;
    }
  
    const playlistRequests = validIds.map((id) => this.playlistService.getPlaylist(id).toPromise());
  
   
    Promise.all(playlistRequests)
      .then((playlists) => {
        this.playlist = playlists;
      })
      .catch((error) => {});
  }
  
  

  private loadUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);

    }
  }
  sendRequest() {

  
    if (!this.user || !this.user._id) {
      Swal.fire('Error', 'No se encontró el usuario.', 'error');
      return;
    }
  
    
    Swal.fire({
      title: 'Procesando solicitud...',
      text: 'Esto puede tardar unos segundos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  

    setTimeout(() => {
      this.userService.updateUserRole(this.user._id, 'cantante').subscribe({
        next: (response) => {
          this.user.rol = 'cantante'; 
          localStorage.setItem('user', JSON.stringify(this.user));
          
        
          Swal.fire('¡Felicidades!', 'Ahora eres cantante.', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar el rol:', err);
          Swal.fire('Error', 'Hubo un error al enviar la solicitud.', 'error');
        }
      });
    }, 10000); 
  }
  
}
