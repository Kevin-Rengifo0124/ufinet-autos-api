import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/auth/storage/storage.service';

const BASIC_URL = "http://localhost:8080";

@Injectable({
  providedIn: 'root'
})
export class Users {

  constructor(private http: HttpClient) { }

  postCar(carData: FormData): Observable<any> {
    const headers = this.createAuthorizationHeader();
    const token = StorageService.getToken();
    const user = StorageService.getUser();

    console.log('🔍 === SERVICIO USERS DEBUG ===');
    console.log('Token enviado:', token);
    console.log('Usuario actual:', user);
    console.log('Headers:', headers.get('Authorization'));
    console.log('URL completa:', BASIC_URL + "/api/user/car");

    console.log('FormData keys:');
    for (let key of carData.keys()) {
      const value = carData.get(key);
      if (value instanceof File) {
        console.log(`  - ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  - ${key}:`, value);
      }
    }

    return this.http.post(BASIC_URL + "/api/user/car", carData, {
      headers: headers,
      responseType: 'text' as 'json' // Para manejar respuestas de texto
    });
  }

  getAllCars(): Observable<any> {
    console.log('🔍 Obteniendo autos para usuario:', StorageService.getUser());
    
    return this.http.get(BASIC_URL + "/api/user/cars", {
      headers: this.createAuthorizationHeader()
    });
  }

  deleteCar(id: number): Observable<any> {
    console.log('🔍 Eliminando auto ID:', id, 'Usuario:', StorageService.getUser());
    
    return this.http.delete(BASIC_URL + "/api/user/car/" + id, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text' as 'json' // Para manejar respuestas de texto
    });
  }

  getCarById(id: number): Observable<any> {
    console.log('🔍 Obteniendo auto ID:', id, 'Usuario:', StorageService.getUser());
    
    return this.http.get(BASIC_URL + "/api/user/car/" + id, {
      headers: this.createAuthorizationHeader()
    });
  }

  updateCar(carId: number, carDto: any): Observable<any> {
    console.log('🔍 Actualizando auto ID:', carId, 'Usuario:', StorageService.getUser());
    
    return this.http.put(BASIC_URL + "/api/user/car/" + carId, carDto, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text' as 'json' // Para manejar respuestas de texto
    });
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    const token = StorageService.getToken();

    if (!token) {
      console.error('No hay token disponible para la autorización');
      return authHeaders;
    }

    return authHeaders.set('Authorization', 'Bearer ' + token);
  }
}