import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth-service.services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  activeButton: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  /** 
   * Cerrar sesión
   */
  logout(){
    this.activeButton = true
    this.authService.logout().subscribe(
      (response) => {
        this.activeButton = false; 
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/home']);
      },
      (error) => {
        this.activeButton = true
        console.error(error);
      }
    );
  }
}
