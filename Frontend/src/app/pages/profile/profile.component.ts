import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
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

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log('Usuario cargado en ngOnInit:', this.user); // ✅ Debe mostrar _id
    }
  }
  
  esCantante(): boolean {
    return this.user?.rol === "cantante";
  }
  
  
  fetchUserProfile() {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      console.error('❌ No hay usuario en localStorage');
      return;
    }
  
    const user = JSON.parse(storedUser);
    if (!user._id) {
      console.error('❌ No se encontró _id en el usuario almacenado');
      return;
    }
  
    this.userService.fetchUserProfile(user._id).subscribe({
      next: (response) => {
        console.log('✅ Perfil obtenido:', response);
        this.user = response.user;
        this.playlists = response.playlists;
        localStorage.setItem('user', JSON.stringify(this.user)); // 🔹 Guardar el usuario actualizado
      },
      error: (err) => {
        console.error('❌ Error al obtener el perfil:', err);
      }
    });
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
    console.log('Usuario actual:', this.user); // Depuración
  
    if (!this.user || !this.user._id) {
      alert('Error: No se encontró el usuario.');
      return;
    }
  
    this.userService.updateUserRole(this.user._id, 'cantante').subscribe({
      next: (response) => {
        this.user.rol = 'cantante'; // 🔹 Actualiza el rol en el frontend
        localStorage.setItem('user', JSON.stringify(this.user)); // 🔹 Guardar en localStorage
        alert('¡Felicidades! Ahora eres cantante.');
      },
      error: (err) => {
        console.error('Error al actualizar el rol:', err);
        alert('Hubo un error al enviar la solicitud.');
      }
    });
  }
  
  
  
}
