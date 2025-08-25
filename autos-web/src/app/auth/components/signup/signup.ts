import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

// NG ZORRO IMPORTS
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup {
  isSpinning = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  formModel = {
    email: '',
    password: '',
    checkPassword: '',
    username: ''
  };

  // Método para enviar el formulario
  onSubmit(): void {
    // Validar que las contraseñas coincidan
    if (this.formModel.password !== this.formModel.checkPassword) {
      console.log('Error: Las contraseñas no coinciden');
      alert('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    // Validar que todos los campos estén llenos
    if (!this.formModel.email || !this.formModel.password || !this.formModel.checkPassword || !this.formModel.username) {
      console.log('Error: Todos los campos son obligatorios');
      alert('Todos los campos son obligatorios.');
      return;
    }

    // Si todo está correcto, proceder con el registro
    this.register();

  }

  register() {
    console.log('Form Data:', this.formModel);
    const signupRequest = {
      email: this.formModel.email,
      password: this.formModel.password,
      name: this.formModel.username
    };

    // Llamar al servicio de registro
    this.authService.register(signupRequest).subscribe({
      next: (response) => {
        this.isSpinning = false;
        console.log('Registration successful!', response);
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');

        // Redireccionar al login después del registro exitoso
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSpinning = false;
        console.error('Registration failed:', error);
        alert('Error en el registro. Por favor inténtalo de nuevo.');
      }
    });
  }
}