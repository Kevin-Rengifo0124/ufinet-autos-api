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

// Services
import { Users } from '../../services/users';
import { StorageService } from '../../../../auth/services/auth/storage/storage.service';

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

  postCar(): void {
    if (!this.isFormValid()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    console.log('=== DEBUG AUTENTICACIÓN ===');
    console.log('Token:', StorageService.getToken());
    console.log('Usuario:', StorageService.getUser());
    console.log('¿Está logueado?:', StorageService.isUserLoggedIn());
    
    // Verificar que el token existe
    const token = StorageService.getToken();
    if (!token) {
      alert('Error: No hay token de autenticación. Por favor inicia sesión nuevamente.');
      return;
    }

    this.isSpinning = true;
    
    const formData = new FormData();
    
    // Mapear campos según CarDto del backend:
    formData.append('brand', this.selectedBrand);                    // ✅ brand
    formData.append('name', this.carModel);                          // ✅ name (no "model")
    formData.append('type', this.selectedType);                      // ✅ type
    formData.append('transmission', this.selectedTransmission);      // ✅ transmission
    formData.append('color', this.selectedColor);                    // ✅ color
    formData.append('description', this.carDescription);             // ✅ description
    formData.append('price', this.carPrice?.toString() || '');       // ✅ price
    
    if (this.carYear) {
      // Crear fecha del 1 de enero del año seleccionado
      const yearDate = new Date(this.carYear, 0, 1);
      formData.append('year', yearDate.toISOString());
    }
    
    // Imagen
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    
    console.log('FormData creado con campos correctos para el backend:');
    for (let key of formData.keys()) {
      const value = formData.get(key);
      if (value instanceof File) {
        console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  - ${key}:`, value);
      }
    }
    
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
        
        // 🔍 DEBUG: Información detallada del error
        console.log('🔍 === DETALLE DEL ERROR ===');
        console.log('Status:', error.status);
        console.log('StatusText:', error.statusText);
        console.log('URL:', error.url);
        console.log('Message:', error.message);
        console.log('Error body:', error.error);
        
        // Mensajes de error más específicos
        if (error.status === 403) {
          alert('Error 403: Acceso denegado.\n\nPosibles causas:\n1. Token expirado\n2. Usuario no autorizado\n3. Configuración de CORS\n\n¡Intenta cerrar sesión y volver a iniciar sesión!');
        } else if (error.status === 401) {
          alert('Error 401: No autenticado.\n\nPor favor inicia sesión nuevamente.');
        } else if (error.status === 400) {
          alert('Error 400: Datos incorrectos.\n\nVerifica que todos los campos estén completos y la imagen sea válida.');
        } else if (error.status === 0) {
          alert('Error de conexión.\n\nNo se puede conectar al servidor. Verifica que el backend esté ejecutándose en puerto 8080.');
        } else {
          alert(`Error ${error.status}: ${error.statusText}\n\nIntenta nuevamente o contacta al administrador.`);
        }
      }
    });
  }
}