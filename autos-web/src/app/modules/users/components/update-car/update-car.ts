import { Component, OnInit } from '@angular/core';
import { Users } from '../../services/users';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.html',
  styleUrls: ['./update-car.scss']
})
export class UpdateCar implements OnInit {
  carId!: number;   

  constructor(
    private userService: Users,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getCarById();
  }

  getCarById(){
    this.userService.getCarById(this.carId).subscribe((res) => {
      console.log('Car data:', res);
    });
  }
}
