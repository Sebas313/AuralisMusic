import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { Playlst } from './pages/playlist/playlst.component';
import { AuthGuard } from './guards/auth.guard';
import { CantanteGuard } from './guards/cantante.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadSongComponent } from './pages/upload-song/upload-song.component';
import { SubirCancionComponent } from './pages/subir-cancion/subir-cancion.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'playlist', component: Playlst, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'upload-song', component: UploadSongComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'subir', component: SubirCancionComponent, canActivate: [CantanteGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/home' },              
];
