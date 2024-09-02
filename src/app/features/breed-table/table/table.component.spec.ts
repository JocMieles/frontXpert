import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BreedsService } from '../../../core/services/breeds.service';
import { of } from 'rxjs';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let breedsServiceSpy: jasmine.SpyObj<BreedsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BreedsService', ['breedSearch']);

    await TestBed.configureTestingModule({
      imports: [TableComponent, FormsModule],
      providers: [
        { provide: BreedsService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    breedsServiceSpy = TestBed.inject(BreedsService) as jasmine.SpyObj<BreedsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch breeds on search', () => {
    const mockBreeds = [
      { name: 'Abyssinian', origin: 'Egypt', life_span: '14 - 15', temperament: 'Active, Energetic' },
      { name: 'Aegean', origin: 'Greece', life_span: '9 - 12', temperament: 'Affectionate, Social' }
    ];
    breedsServiceSpy.breedSearch.and.returnValue(of(mockBreeds));

    component.onSearch();

    expect(breedsServiceSpy.breedSearch).toHaveBeenCalledWith('');
    expect(component.filteredBreeds).toEqual(mockBreeds);
  });

  it('should filter breeds based on search text', () => {
    const mockBreeds = [
      { name: 'Abyssinian', origin: 'Egypt', life_span: '14 - 15', temperament: 'Active, Energetic' },
      { name: 'Aegean', origin: 'Greece', life_span: '9 - 12', temperament: 'Affectionate, Social' }
    ];
    breedsServiceSpy.breedSearch.and.returnValue(of(mockBreeds));

    component.searchText = 'Abyssinian';
    component.onSearch();

    expect(breedsServiceSpy.breedSearch).toHaveBeenCalledWith('Abyssinian');
    expect(component.filteredBreeds).toEqual(mockBreeds);
  });
});
