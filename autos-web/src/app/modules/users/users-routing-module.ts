import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersDashboard } from './components/users-dashboard/users-dashboard';
const routes: Routes = [
  { path: 'dashboard', component: UsersDashboard }  // Cuando acceda a /dashboard, muestra UsersDashboard
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
