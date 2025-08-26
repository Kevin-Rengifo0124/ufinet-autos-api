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
    private router: Router
  ) {
    // Obtener ID de los parámetros de la ruta
    const id = this.activatedRoute.snapshot.params['id'];
    this.carId = Number(id);
    
    console.log('🔍 UpdateCar - ID del parámetro:', id);
    console.log('🔍 UpdateCar - carId convertido:', this.carId);
    
    // Verificar que el ID es válido
    if (!this.carId || isNaN(this.carId)) {
      console.error('❌ ID de carro inválido:', id);
      this.message.error('ID de vehículo no válido');
      this.router.navigate(['/dashboard']);
      return;
    }
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
      description: [null]
    });

    this.getCarById();
  }

  updateCar() {
    if (this.updateForm.invalid) {
      console.log('❌ Formulario inválido');
      this.message.error('Por favor complete todos los campos requeridos');
      return;
    }

    this.isSpinning = true;
    const formData: FormData = new FormData();
    
    // Solo agregar imagen si se cambió
    if (this.imgChanged && this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    // Agregar todos los campos del formulario
    formData.append('brand', this.updateForm.get('brand')!.value);
    formData.append('name', this.updateForm.get('name')!.value);
    formData.append('type', this.updateForm.get('type')!.value);
    formData.append('color', this.updateForm.get('color')!.value);
    formData.append('year', this.updateForm.get('year')!.value);
    formData.append('transmission', this.updateForm.get('transmission')!.value);
    formData.append('description', this.updateForm.get('description')!.value || '');
    formData.append('price', this.updateForm.get('price')!.value);

    console.log('📤 Actualizando carro con ID:', this.carId);
    
    this.userService.updateCar(this.carId, formData).subscribe({
      next: (res) => {
        this.isSpinning = false;
        console.log('✅ Carro actualizado:', res);
        this.message.success("Auto actualizado correctamente", { nzDuration: 5000 });
        this.router.navigateByUrl("/dashboard");
      },
      error: (error) => {
        this.isSpinning = false;
        console.error('❌ Error al actualizar carro:', error);
        this.message.error("Error al actualizar el auto", { nzDuration: 5000 });
      }
    });
  }

  getCarById() {
    this.isSpinning = true;
    console.log('📥 Obteniendo carro con ID:', this.carId);
    
    this.userService.getCarById(this.carId).subscribe({
      next: (res) => {
        this.isSpinning = false;
        console.log('✅ Datos del carro obtenidos:', res);
        
        const carDto = res;
        
        // Procesar imagen existente
        if (res.returnedImage) {
          this.existingImage = 'data:image/jpeg;base64,' + res.returnedImage;
        }
        
        // Llenar el formulario con los datos del carro
        this.updateForm.patchValue({
          name: carDto.name,
          brand: carDto.brand,
          type: carDto.type,
          color: carDto.color,
          transmission: carDto.transmission,
          price: carDto.price,
          year: carDto.year,
          description: carDto.description
        });
      },
      error: (error) => {
        this.isSpinning = false;
        console.error('❌ Error al obtener datos del carro:', error);
        this.message.error('Error al cargar los datos del vehículo', { nzDuration: 5000 });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.imgChanged = true;
      this.existingImage = null;
      this.previewImage();
    }
  }

  previewImage() {
    if (!this.selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}