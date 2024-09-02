import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreedsService } from '../../../core/services/breeds.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent  {

  constructor(private breedsService: BreedsService) {}

  searchText: string = '';
  filteredBreeds: any[] = [];
  onSearch() {
    this.fetchBreeds(this.searchText);
  }

  fetchBreeds(query: string = ''): void {
    this.breedsService.breedSearch(query).subscribe({
      next: (response) => {
        this.filteredBreeds = response;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
  }
}
