import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CarouselComponent } from './carousel.component';
import { BreedsService } from '../../../core/services/breeds.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let breedsServiceSpy: jasmine.SpyObj<BreedsService>;

  beforeEach(async () => {
    breedsServiceSpy = jasmine.createSpyObj('BreedsService', ['breeds', 'breedId', 'imagesBreed']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);

    // Configura los métodos simulados para que devuelvan observables
    breedsServiceSpy.breeds.and.returnValue(of([]));
    breedsServiceSpy.breedId.and.returnValue(of({}));
    breedsServiceSpy.imagesBreed.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Importa el módulo de testing para HttpClient
        CarouselComponent
      ],
      providers: [
        { provide: BreedsService, useValue: breedsServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllBreeds and populate breeds array on init', () => {
    const mockBreeds = [{ id: '1', name: 'Breed 1' }, { id: '2', name: 'Breed 2' }];
    breedsServiceSpy.breeds.and.returnValue(of(mockBreeds));

    component.getAllBreeds();

    expect(breedsServiceSpy.breeds).toHaveBeenCalled();
    expect(component.breeds).toEqual(mockBreeds);
  });

  it('should handle error when getAllBreeds fails', () => {
    breedsServiceSpy.breeds.and.returnValue(throwError(() => new Error('Error fetching breeds')));

    component.getAllBreeds();

    expect(breedsServiceSpy.breeds).toHaveBeenCalled();
    expect(component.breeds).toEqual([]);
  });

  it('should call selectBreed and populate selectedBreed and images arrays', () => {
    const mockBreed = { id: '1', name: 'Breed 1' };
    const mockImages = [{ url: 'image1.jpg' }, { url: 'image2.jpg' }];

    breedsServiceSpy.breedId.and.returnValue(of(mockBreed));
    breedsServiceSpy.imagesBreed.and.returnValue(of(mockImages));

    const event = { value: '1' };
    component.selectBreed(event);

    expect(breedsServiceSpy.breedId).toHaveBeenCalledWith('1');
    expect(component.selectedBreed).toEqual(mockBreed);
    expect(component.images).toEqual(mockImages);
  });

  it('should handle error when selectBreed fails to fetch breed by ID', () => {
    breedsServiceSpy.breedId.and.returnValue(throwError(() => new Error('Error fetching breed by ID')));

    const event = { value: '1' };
    component.selectBreed(event);

    expect(breedsServiceSpy.breedId).toHaveBeenCalledWith('1');
    expect(component.selectedBreed).toBeNull();
  });

  it('should handle error when selectBreed fails to fetch breed images', () => {
    const mockBreed = { id: '1', name: 'Breed 1' };
    breedsServiceSpy.breedId.and.returnValue(of(mockBreed));
    breedsServiceSpy.imagesBreed.and.returnValue(throwError(() => new Error('Error fetching breed images')));

    const event = { value: '1' };
    component.selectBreed(event);

    expect(breedsServiceSpy.imagesBreed).toHaveBeenCalledWith('1');
    expect(component.images).toEqual([]);
  });

});
