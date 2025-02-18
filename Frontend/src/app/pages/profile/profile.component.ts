import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, HeaderComponent],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  playlists: any[] = [];
  selectedFile: File | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const userId = localStorage.getItem('userId');
    console.log('userId:', userId);  // Asegúrate de que el userId esté disponible
    if (userId) {
      this.userService.fetchUserProfile(userId).subscribe({
        next: (response) => {
          console.log('Response:', response);  // Verifica lo que devuelve el backend
          this.user = response.user;
          this.playlists = response.playlists;
        },
        error: (err) => {
          console.error('Error al obtener el perfil:', err);
        }
      });
    } else {
      console.error('No se encontró el ID del usuario');
    }
  }
  
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadProfilePhoto();
    }
  }

  uploadProfilePhoto() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('avatar', this.selectedFile);

    this.userService.uploadProfilePhoto(formData).subscribe({
      next: (response) => {
        this.user.avatar = response.avatar;
        alert('Foto de perfil actualizada con éxito.');
      },
      error: (err) => {
        console.error('Error al actualizar la foto de perfil:', err);
      }
    });
  }

  editProfilePhoto() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.onchange = (event: any) => {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.uploadProfilePhoto();
      }
    };
  }

  sendRequest() {
    alert('Solicitud para ser cantante enviada con éxito.');
  }
}
