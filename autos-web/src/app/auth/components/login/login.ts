import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { StorageService } from '../../services/auth/storage/storage.service';

// NG-Zorro módulos
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSpinModule,
    NzGridModule,
    NzIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  isSpinning = false;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isSpinning = true;
      
      console.log('Enviando datos de login:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isSpinning = false;
          console.log('✅ Login successful!', res);
          
          // 🔍 DEBUG: Logs detallados de la respuesta
          console.log('🔍 Respuesta completa:', JSON.stringify(res, null, 2));
          console.log('🆔 res.userId:', res.userId);
          console.log('🔑 res.jwt:', res.jwt);
          console.log('🔑 res.token:', res.token); // Por si acaso viene token también
          
          // ✅ Guardar token e id juntos en el mismo objeto
          if (res.jwt || res.token) {
            const token = res.jwt || res.token;
            
            // Crear objeto que incluya tanto token como id del usuario
            const userSession = {
              token: token,
              id: res.userId || res.id || null
            };
            
            console.log('💾 Guardando sesión completa:', JSON.stringify(userSession, null, 2));
            
            // Guardar token por separado (por compatibilidad)
            StorageService.saveToken(token);
            
            // Guardar usuario con token incluido
            StorageService.saveUser(userSession);
            
            console.log('✅ Sesión guardada:', StorageService.getUser());
            console.log('✅ Token guardado:', StorageService.getToken());
            
            alert('¡Login exitoso!');
            
            // Redireccionar al dashboard del usuario
            this.router.navigate(['/dashboard']);
            
          } else {
            console.log('❌ No se recibió jwt ni token');
            alert('Error: No se recibió token de autenticación');
          }
        },
        error: (error) => {
          this.isSpinning = false;
          console.error('❌ Login failed:', error);
          
          let errorMessage = 'Error en el login. Por favor inténtalo de nuevo.';
          
          if (error.status === 401) {
            errorMessage = '🔒 Credenciales incorrectas. Verifica tu email y contraseña.';
          } else if (error.status === 403) {
            errorMessage = '🚫 Acceso denegado. Tu cuenta puede estar bloqueada.';
          } else if (error.status === 404) {
            errorMessage = '👤 Usuario no encontrado. Verifica tu email.';
          } else if (error.status === 0) {
            errorMessage = '🌐 No se puede conectar al servidor. Verifica tu conexión a internet.';
          } else if (error.status >= 500) {
            errorMessage = '⚠️ Error del servidor. Intenta nuevamente en unos minutos.';
          }
          
          alert(errorMessage);
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}