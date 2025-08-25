import { Routes } from '@angular/router';
import { Signup } from './auth/components/signup/signup';
import { Login } from './auth/components/login/login';

export const routes: Routes = [
  { path: 'register', component: Signup },
  { path: 'login', component: Login },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./modules/users/users-module').then(m => m.UsersModule),
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Cualquier ruta no encontrada va al login
];