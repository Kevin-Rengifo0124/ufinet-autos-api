import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../auth/services/auth/storage/storage.service';
import { CommonModule } from '@angular/common';


// NG-Zorro imports
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Users } from '../../services/users';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminRoutingModule } from "../../../admin/admin-routing-module";

@Component({
  selector: 'app-users-dashboard',
  imports: [
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzCardModule,
    NzIconModule,
    NzSpinModule,
    AdminRoutingModule
],
  templateUrl: './users-dashboard.html',
  styleUrl: './users-dashboard.scss'
})
export class UsersDashboard implements OnInit {

  cars: any[] = []; 

  constructor(private userService: Users, private message:NzMessageService) { }

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.userService.getAllCars().subscribe((res: any[]) => {
      console.log(res);
      res.forEach((element: any) => {
        element.proccessedImage = 'data:image/jpeg;base64,' + element.returnedImage.data;
        this.cars.push(element); 
      });
    })
  }

  deleteCar(id: number){
    this.userService.deleteCar(id).subscribe((res) => {
      this.cars = [];
      this.getAllCars();
      this.message.success("Car deleted successfully", { nzDuration: 5000});
    })
  }

}
