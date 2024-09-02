import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when email and password are provided', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should have an invalid form when email or password is missing', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeFalse();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should call the login method of AuthService when the form is valid and submitted', () => {
    const mockResponse = { token: 'fake-token', user: { name: 'John Doe', email: 'johndoe@example.com' } };
    authServiceSpy.login.and.returnValue(of(mockResponse ));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menu']);
  });

  it('should set errorMessage on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError({ status: 401 }));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.onSubmit();

    expect(component.errorMessage).toBe('Email o contraseña incorrectos');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to register page when goToRegister is called', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login/register']);
  });
});
