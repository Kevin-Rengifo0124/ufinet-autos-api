import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';

// NG-Zorro imports necesarios para el template
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Users } from '../../services/users';

@Component({
  selector: 'app-post-car',
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
    NzIconModule
  ],
  templateUrl: './post-car.html',
  styleUrl: './post-car.scss'
})
export class PostCar {
  // Propiedades para el spinner y formulario
  isSpinning = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Propiedades del formulario
  selectedBrand: string = '';
  carModel: string = '';
  selectedType: string = '';
  selectedTransmission: string = '';
  selectedColor: string = '';
  carYear: number | null = null;
  carPrice: number | null = null;
  carMileage: number | null = null;
  carDescription: string = '';

  // Arrays para los selects
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

  constructor(private fb: FormBuilder, private userService: Users) {}

  // Formatters para los input-number
  priceFormatter = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  priceParser = (value: string): number => parseFloat(value.replace(/\$\s?|(,*)/g, '')) || 0;
  
  mileageFormatter = (value: number): string => `${value} km`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  mileageParser = (value: string): number => parseFloat(value.replace(/[^\d]/g, '')) || 0;

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Validar si el formulario está completo
  isFormValid(): boolean {
    return !!(
      this.selectedBrand &&
      this.carModel &&
      this.selectedType &&
      this.selectedTransmission &&
      this.selectedColor &&
      this.carYear &&
      this.carPrice &&
      this.carDescription &&
      this.selectedFile
    );
  }

  // Obtener la longitud de la descripción de forma segura
  getDescriptionLength(): number {
    return this.carDescription ? this.carDescription.length : 0;
  }

  // Limpiar el formulario
  resetForm(): void {
    this.selectedBrand = '';
    this.carModel = '';
    this.selectedType = '';
    this.selectedTransmission = '';
    this.selectedColor = '';
    this.carYear = null;
    this.carPrice = null;
    this.carMileage = null;
    this.carDescription = '';
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Método para enviar el formulario
  postCar(): void {
    if (!this.isFormValid()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    this.isSpinning = true;
    
    // Crear FormData para enviar imagen + datos
    const formData = new FormData();
    formData.append('brand', this.selectedBrand);
    formData.append('model', this.carModel);
    formData.append('type', this.selectedType);
    formData.append('transmission', this.selectedTransmission);
    formData.append('color', this.selectedColor);
    formData.append('year', this.carYear?.toString() || '');
    formData.append('price', this.carPrice?.toString() || '');
    formData.append('mileage', this.carMileage?.toString() || '0');
    formData.append('description', this.carDescription);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    console.log('Publicando vehículo...');
    
    // Llamar al servicio Users
    this.userService.postCar(formData).subscribe({
      next: (response: any) => {
        this.isSpinning = false;
        console.log('Vehículo publicado exitosamente:', response);
        alert('¡Vehículo publicado exitosamente!');
        this.resetForm();
      },
      error: (error: any) => {
        this.isSpinning = false;
        console.error('Error al publicar vehículo:', error);
        alert('Error al publicar el vehículo. Intente nuevamente.');
      }
    });
  }
}