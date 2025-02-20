import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { Playlst } from './pages/playlist/playlst.component';
import { AuthGuard } from './guards/auth.guard'; 
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadSongComponent } from './pages/upload-song/upload-song.component';
import { VerificarEmailComponent } from './verificar-email/verificar-email.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'playlist', component: Playlst, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'upload-song', component: UploadSongComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent }, 
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/home' },              
  {path: 'verificar-email', component:VerificarEmailComponent}
];
