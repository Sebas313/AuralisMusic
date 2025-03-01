import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { Playlst } from './pages/playlist/playlst.component';
import { AuthGuard } from './guards/auth.guard';
import { CantanteGuard } from './guards/cantante.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { VerificarEmailComponent } from './pages/verificar-email/verificar-email.component';
import { SubirCancionComponent } from './pages/subir-cancion/subir-cancion.component';
import { VerificarComponent } from './pages/verificar/verificar.component';
import { PrivatePlaylistComponent } from './pages/private-playlist/private-playlist.component';
import { VerificacionExitosaComponent } from './pages/verificacion-exitosa/verificacion-exitosa.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'playlist', component: Playlst, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent },
  { path: 'playlist/:id', component: PrivatePlaylistComponent }, 
  { path: 'subir', component: SubirCancionComponent, canActivate: [CantanteGuard] },           
  { path: 'verificar-email', component: VerificarEmailComponent }, // Ruta para la página de verificación
  { path: 'verificar/:token', component: VerificarComponent }, // Ruta para el proceso de verificación con token
  { path: 'verificacion-exitosa', component: VerificacionExitosaComponent }, 
];


