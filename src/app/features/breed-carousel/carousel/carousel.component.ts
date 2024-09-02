import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BreedsService } from '../../../core/services/breeds.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  breeds: any = [];
  selectedBreed: any = null;
  images: any[] = [];

  constructor(private breedsService: BreedsService) {
    this.getAllBreeds();
  }

  getAllBreeds() {
    this.breedsService.breeds()
      .subscribe({
        next: (response) => {
          this.breeds = response;
        },
        error: (error) => {
          console.error('Error fetching breeds', error);
        }
      });
  }

  selectBreed(event: any) {
    const breedId = event.value;
    this.images = [];
    
    this.breedsService.breedId(breedId)
      .subscribe({
        next: (response) => {
          this.selectedBreed = response;
        },
        error: (error) => {
          console.error('Error fetching breed by ID', error);
        }
      });

    this.breedsService.imagesBreed(breedId)
      .subscribe({
        next: (response) => {
          this.images = response;
        },
        error: (error) => {
          console.error('Error fetching breed images', error);
        }
      });
  }
}
