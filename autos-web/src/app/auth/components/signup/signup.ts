import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    FormsModule, // ← IMPORTANTE: FormsModule para template-driven forms
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
  
  // Modelo para template-driven forms (coincide con tu HTML)
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
    this.isSpinning = true;
    this.register();
    
    setTimeout(() => {
      this.isSpinning = false;
      console.log('Registration successful!');
    }, 2000);
  }

  register() {
    console.log('Form Data:', this.formModel);
  }
}