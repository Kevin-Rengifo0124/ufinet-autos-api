import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersDashboard } from '../users/components/users-dashboard/users-dashboard';
import { PostCar } from '../users/components/post-car/post-car';

const routes: Routes = [
  {path: "dashboard", component: UsersDashboard},
  {path: "car", component: PostCar}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
