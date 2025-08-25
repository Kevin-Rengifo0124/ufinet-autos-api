import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersDashboard } from './components/users-dashboard/users-dashboard';
import { PostCar } from './components/post-car/post-car';
const routes: Routes = [
  { path: 'dashboard', component: UsersDashboard },
  {path: 'car', component: PostCar}  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
