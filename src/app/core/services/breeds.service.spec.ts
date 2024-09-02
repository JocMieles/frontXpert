import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BreedsService } from './breeds.service';

describe('BreedsService', () => {
  let service: BreedsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BreedsService]
    });
    service = TestBed.inject(BreedsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch breeds list', () => {
    const dummyBreeds = [{ name: 'Abyssinian' }, { name: 'Aegean' }];

    service.breeds().subscribe(breeds => {
      expect(breeds.length).toBe(2);
      expect(breeds).toEqual(dummyBreeds);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/breeds`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBreeds);
  });

  it('should fetch breed by id', () => {
    const dummyBreed = { name: 'Abyssinian', id: 'abys' };

    service.breedId('abys').subscribe(breed => {
      expect(breed).toEqual(dummyBreed);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/breeds/abys`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBreed);
  });

  it('should search breeds', () => {
    const dummySearchResults = [{ name: 'Abyssinian' }];

    service.breedSearch('Abyssinian').subscribe(breeds => {
      expect(breeds.length).toBe(1);
      expect(breeds).toEqual(dummySearchResults);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/breeds/search?q=Abyssinian`);
    expect(req.request.method).toBe('GET');
    req.flush(dummySearchResults);
  });

  it('should fetch images for breed', () => {
    const dummyImages = [{ url: 'image1.jpg' }, { url: 'image2.jpg' }];

    service.imagesBreed('abys').subscribe(images => {
      expect(images.length).toBe(2);
      expect(images).toEqual(dummyImages);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/imagesbybreedid/abys`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyImages); 
  });
});
