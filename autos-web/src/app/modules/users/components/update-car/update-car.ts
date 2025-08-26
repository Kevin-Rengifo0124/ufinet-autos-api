import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '../../services/users';
import { NzMessageService } from 'ng-zorro-antd/message';


// NG-Zorro imports necesarios para el template
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';


@Component({
  selector: 'app-update-car',
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
    NzIconModule
  ],
  templateUrl: './update-car.html',
  styleUrls: ['./update-car.scss']
})
export class UpdateCarComponent {

  isSpinning = false;
  carId: number;
  imgChanged = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  existingImage: string | null = null;

  updateForm!: FormGroup;

  listOfOption: Array<{ label: string; value: string }> = [];

  listOfBrands: string[] = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan',
    'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Volkswagen',
    'BMW', 'Mercedes-Benz', 'Audi', 'Renault', 'Peugeot'
  ];

  listOfType: string[] = [
    'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible',
    'Pickup', 'Van', 'Wagon', 'Crossover'
  ];

  listOfTransmission: string[] = [
    'Manual', 'Automática', 'CVT', 'Semi-automática'
  ];

  listOfColor: string[] = [
    'Blanco', 'Negro', 'Plata', 'Gris', 'Azul',
    'Rojo', 'Verde', 'Amarillo', 'Naranja', 'Morado',
    'Beige', 'Marrón', 'Dorado'
  ];


  constructor(
    private userService: Users,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router)
  {
    this.carId = Number(this.activatedRoute.snapshot.params['id']);
  }
  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      year: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      mileage: [null, [Validators.required, Validators.min(0)]],
      description: [null]
    });

    this.getCarById();
  }

  updateCar() {
  this.isSpinning = true;
  const formData: FormData = new FormData();
  if(this.imgChanged && this.selectedFile){
      formData.append('image', this.selectedFile);

  }
  formData.append('brand', this.updateForm.get('brand')!.value);
  formData.append('name', this.updateForm.get('name')!.value);
  formData.append('type', this.updateForm.get('type')!.value);
  formData.append('color', this.updateForm.get('color')!.value);
  formData.append('year', this.updateForm.get('year')!.value);
  formData.append('transmission', this.updateForm.get('transmission')!.value);
  formData.append('description', this.updateForm.get('description')!.value);
  formData.append('price', this.updateForm.get('price')!.value);


  console.log(formData);

  this.userService.updateCar(this.carId,formData).subscribe((res) => {
    this.isSpinning = false;
    this.message.success("Auto actualizado correctamente", { nzDuration: 5000 });
    this.router.navigateByUrl("/user/dashboard");
    console.log(res);
  }, error => {
    this.message.error("Error al actualizar el auto", { nzDuration: 5000 })
  })
}

  getCarById() {
    this.isSpinning = true;
    this.userService.getCarById(this.carId).subscribe((res) => {
      this.isSpinning = false;
      const carDto = res;
      this.existingImage = 'data:image/jpeg;base64,' + res.returnedImage;
      this.updateForm.patchValue(carDto);
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.imgChanged = true;
    this.existingImage = null;
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }


}