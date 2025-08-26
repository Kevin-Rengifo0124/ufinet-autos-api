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
  showDebugInfo = true; // Cambiar a false en producción

  constructor(private userService: Users, private message: NzMessageService) { }

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.cars = []; // Limpiar array antes de cargar
    
    this.userService.getAllCars().subscribe({
      next: (res: any[]) => {
        console.log('🚗 Respuesta getAllCars:', res);
        
        if (res && Array.isArray(res)) {
          res.forEach((element: any) => {
            console.log('🔍 Procesando carro:', element);
            
            // Verificar que el carro tiene ID
            if (!element.id) {
              console.error('❌ Carro sin ID encontrado:', element);
              return;
            }
            
            // Procesar imagen correctamente
            if (element.returnedImage) {
              // Si returnedImage es un string base64 directo
              if (typeof element.returnedImage === 'string') {
                element.processedImage = 'data:image/jpeg;base64,' + element.returnedImage;
              }
              // Si returnedImage es un objeto con data property
              else if (element.returnedImage.data) {
                element.processedImage = 'data:image/jpeg;base64,' + element.returnedImage.data;
              }
              // Si returnedImage es un array de bytes
              else if (Array.isArray(element.returnedImage)) {
                const base64String = btoa(String.fromCharCode.apply(null, element.returnedImage));
                element.processedImage = 'data:image/jpeg;base64,' + base64String;
              }
            } else {
              // Imagen por defecto si no hay imagen
              element.processedImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }
            
            this.cars.push(element);
          });
          
          console.log('✅ Carros procesados:', this.cars);
        } else {
          console.error('❌ Respuesta no es un array:', res);
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar carros:', error);
        this.message.error('Error al cargar los vehículos', { nzDuration: 5000 });
      }
    });
  }

  deleteCar(id: number) {
    if (!id) {
      console.error('❌ ID de carro es undefined o null');
      this.message.error('Error: ID de vehículo no válido', { nzDuration: 5000 });
      return;
    }

    this.userService.deleteCar(id).subscribe({
      next: (res) => {
        console.log('✅ Carro eliminado:', res);
        this.getAllCars(); // Recargar lista
        this.message.success("Vehículo eliminado exitosamente", { nzDuration: 5000 });
      },
      error: (error) => {
        console.error('❌ Error al eliminar carro:', error);
        this.message.error('Error al eliminar el vehículo', { nzDuration: 5000 });
      }
    });
  }

  // Método para trackBy en ngFor (mejora performance)
  trackByCarId(index: number, car: any): any {
    return car.id || index;
  }

  // Método para manejar errores de carga de imagen
  onImageError(event: any) {
    console.log('❌ Error cargando imagen, usando imagen por defecto');
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
}