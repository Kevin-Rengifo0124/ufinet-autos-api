import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersDashboard } from './components/users-dashboard/users-dashboard';
import { PostCar } from './components/post-car/post-car';
import { UpdateCar } from './components/update-car/update-car';

const routes: Routes = [
  { path: '', component: UsersDashboard },
  { path: 'car', component: PostCar },
  { path: 'car/:id', component: UpdateCar }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }