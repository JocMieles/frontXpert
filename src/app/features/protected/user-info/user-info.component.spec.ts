import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { AuthService } from '../../../core/services/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['getUserInfo']);

    await TestBed.configureTestingModule({
      imports: [UserInfoComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;

    // Configura el espía para devolver un objeto con las propiedades name y email
    authServiceSpyObj.getUserInfo.and.returnValue({ name: 'John Doe', email: 'johndoe@example.com' });
    component.user = authServiceSpyObj.getUserInfo();
    fixture.detectChanges(); // Detecta los cambios y renderiza la vista
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    fixture.detectChanges(); // Aplica los cambios

    const nameElement = fixture.debugElement.query(By.css('li:first-child')).nativeElement;
    const emailElement = fixture.debugElement.query(By.css('li:nth-child(2)')).nativeElement;

    expect(nameElement.textContent).toContain('John Doe');
    expect(emailElement.textContent).toContain('johndoe@example.com');
  });
});
