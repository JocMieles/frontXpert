import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserInfoComponent } from '../protected/user-info/user-info.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BreedsService } from '../../core/services/breeds.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, UserInfoComponent, CarouselModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  images: any[] = [
    // Agrega más rutas de imágenes según necesites
  ];
  value: any;
  selectedBreed: any = null;

  constructor(private authService: AuthService, private router: Router, private breedsService: BreedsService) {
    this.getAllBreeds();
  }
  isUserMenuOpen = false;
  userEmail = 'user@example.com';
  breeds: any = [];

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }


  getAllBreeds() {
    this.breedsService.breeds()
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.breeds = response;
        },

        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }

  selectBreed(arg0: any) {
    this.selectedBreed = this.breeds.find((breed: { id: any; }) => breed.id === arg0.value);
    console.log(arg0.value)
    this.images = []
    this.breedsService.imagesBreed(arg0.value)
      .subscribe({
        next: (response) => {
          console.log('Image successful', response);
         
            this.images = response
   
          //this.images = response;
          //this.breeds = response;
        },

        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
}
