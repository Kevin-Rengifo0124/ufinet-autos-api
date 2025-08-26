import { Component, OnInit } from '@angular/core';
import { Users } from '../../services/users';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


// NG-Zorro imports
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-update-car',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzSelectModule,
    NzGridModule,
    NzIconModule,
    NzDatePickerModule
  ],
  templateUrl: './update-car.html',
  styleUrls: ['./update-car.scss']
})
export class UpdateCar implements OnInit {
  carId!: number;
  imgChanged: boolean = false;
  selectedFile: any;
  existingImage: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  isSpinning = false;
  validateForm!: FormGroup;

  listOfBrand = ['Toyota', 'Ford', 'BMW'];
  listOfType = ['SUV', 'Sedan', 'Truck'];
  listOfTransmission = ['Manual', 'Automatic'];
  listOfColor = ['Red', 'Blue', 'Black'];

  constructor(
    private userService: Users,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.carId = this.activatedRoute.snapshot.params['id'];
    this.buildForm();
    this.getCarById();
  }

  buildForm() {
    this.validateForm = this.fb.group({
      brand: [null, Validators.required],
      name: [null, Validators.required],
      type: [null, Validators.required],
      transmission: [null, Validators.required],
      color: [null, Validators.required],
      year: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required]
    });
  }

  getCarById() {
    this.isSpinning = true;
    this.userService.getCarById(this.carId).subscribe((res) => {
      this.isSpinning = false;
      console.log('Car data:', res);

      const carDto = res;
      this.existingImage = 'data:image/jpeg;base64,' + carDto.returnedImage;

      // Set form values
      this.validateForm.patchValue({
        brand: carDto.brand,
        name: carDto.name,
        type: carDto.type,
        transmission: carDto.transmission,
        color: carDto.color,
        year: carDto.year,
        price: carDto.price,
        description: carDto.description
      });
    });
  }

  // para el (change)="onFileSelected($event)"
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.imgChanged = true;
    this.existingImage = null;
    this.previewImage();
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitForm() {
    if (this.validateForm.valid) {
      console.log('Form values:', this.validateForm.value);
    } else {
      console.log('Form inválido');
    }
  }
}
