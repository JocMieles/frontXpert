import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
    localStorage.clear(); // Limpia el localStorage después de cada prueba
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store the token and user info on login', () => {
    const mockResponse = {
      token: 'fake-token',
      user: { name: 'John Doe', email: 'johndoe@example.com' }
    };

    service.login('test@example.com', 'password123').subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/users/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(mockResponse.user);
  });

  it('should clear token and redirect on logout', () => {
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return user info from localStorage', () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const userInfo = service.getUserInfo();
    expect(userInfo).toEqual(mockUser);
  });

  it('should return true if authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should retrieve the token from localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    const token = service.getToken();
    expect(token).toBe('fake-token');
  });

  it('should register a user', () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' };
    const mockResponse = { success: true };

    service.register(mockUser).subscribe(response => {
      expect(response.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
