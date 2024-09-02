import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: spy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should add an Authorization header', () => {
    authServiceSpy.getToken.and.returnValue('fake-token');

    httpClient.get('/test').subscribe(response => expect(response).toBeTruthy());

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe('fake-token');
  });

  it('should call logout on 403 error', () => {
    authServiceSpy.getToken.and.returnValue('fake-token');

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 403 error'),
      error: error => {
        expect(error.status).toBe(403);
      }
    });

    const httpRequest = httpMock.expectOne('/test');

    httpRequest.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
