import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserInfoComponent } from '../protected/user-info/user-info.component';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, UserInfoComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  user: { name: string; email: string } = { name: '', email: '' };
  isCarouselOrTableRoute = false;
  isModalOpen = false;
   constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUserInfo();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCarouselOrTableRoute = event.url.includes('/carousel') || event.url.includes('/table');
      }
    });
  }
  isUserMenuOpen = false;
  

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeDropdown() {
    if (this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  openModal() {
    this.isUserMenuOpen = false;
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
