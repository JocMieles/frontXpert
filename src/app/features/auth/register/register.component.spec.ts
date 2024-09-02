import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are provided', () => {
    component.registerForm.controls['name'].setValue('John Doe');
    component.registerForm.controls['email'].setValue('john@example.com');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should have an invalid form when required fields are missing', () => {
    component.registerForm.controls['name'].setValue('');
    component.registerForm.controls['email'].setValue('john@example.com');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should call the register method of AuthService when form is valid and submitted', () => {
    const registerSpy = authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.controls['name'].setValue('John Doe');
    component.registerForm.controls['email'].setValue('john@example.com');
    component.registerForm.controls['password'].setValue('password123');

    component.onSubmit();

    expect(registerSpy).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
  });

  it('should navigate to /login on successful registration', () => {
    authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.controls['name'].setValue('John Doe');
    component.registerForm.controls['email'].setValue('john@example.com');
    component.registerForm.controls['password'].setValue('password123');

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set errorMessage on registration failure', () => {
    authServiceSpy.register.and.returnValue(throwError({ status: 400 }));
    component.registerForm.controls['name'].setValue('John Doe');
    component.registerForm.controls['email'].setValue('john@example.com');
    component.registerForm.controls['password'].setValue('password123');

    component.onSubmit();

    expect(component.errorMessage).toBe('nombre, contraseña o email malos');
  });

  it('should navigate to /login when goToLogin is called', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
