import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

const eventSubject = new ReplaySubject<NavigationEnd>();

const routerMock = {
  navigate: jasmine.createSpy('navigate'),
  events: eventSubject.asObservable(),
  url: 'url',
  createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({}), // Añadir createUrlTree
  serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue('url') // Añadir serializeUrl
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo', 'logout']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MenuComponent,
        RouterTestingModule.withRoutes([]), // Importar RouterTestingModule con rutas vacías
      ],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }, // Mock ActivatedRoute como un objeto vacío
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    // Mockear la respuesta de getUserInfo
    authServiceSpy.getUserInfo.and.returnValue({ name: 'John Doe', email: 'johndoe@example.com' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle user menu', () => {
    component.isUserMenuOpen = false;
    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeTrue();

    component.toggleUserMenu();
    expect(component.isUserMenuOpen).toBeFalse();
  });

  it('should close dropdown when closeDropdown is called', () => {
    component.isUserMenuOpen = true;
    component.closeDropdown();
    expect(component.isUserMenuOpen).toBeFalse();
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should open and close modal', () => {
    component.isModalOpen = false;
    component.openModal();
    expect(component.isModalOpen).toBeTrue();

    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should navigate to home when navigateToHome is called', () => {
    component.navigateToHome();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set isCarouselOrTableRoute to true for /carousel route', () => {
    eventSubject.next(new NavigationEnd(1, '/carousel', '/carousel'));
    expect(component.isCarouselOrTableRoute).toBeTrue();
  });

  it('should set isCarouselOrTableRoute to true for /table route', () => {
    eventSubject.next(new NavigationEnd(1, '/table', '/table'));
    expect(component.isCarouselOrTableRoute).toBeTrue();
  });

  it('should set isCarouselOrTableRoute to false for other routes', () => {
    eventSubject.next(new NavigationEnd(1, '/other', '/other'));
    expect(component.isCarouselOrTableRoute).toBeFalse();
  });
 
});
