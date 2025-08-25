import { Routes } from '@angular/router';
import { Signup } from './auth/components/signup/signup';
import { Login } from './auth/components/login/login';

export const routes: Routes = [
  { path: 'register', component: Signup },
  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // opcional
];