import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

// NG ZORRO IMPORTS necesarios para el template
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { StorageService } from './auth/services/auth/storage/storage.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NzLayoutModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('autos-web');
  isUserLoggedIn: boolean = StorageService.isUserLoggedIn();

  constructor(private router : Router) { }

  ngOnInit(){
    this.router.events.subscribe(event => {  
      if(event.constructor.name === "NavigationEnd"){
        this.isUserLoggedIn = StorageService.isUserLoggedIn();
      } 
    });
  }
   logout() {
    StorageService.logout(); // Asumiendo que tienes este método
    this.isUserLoggedIn = false;
    this.router.navigate(['/login']);
  }
}