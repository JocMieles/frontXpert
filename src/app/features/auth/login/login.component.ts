import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,  // Inyectar el servicio de autenticación
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            console.log('Login successful', response);
            // Guardar el token en el almacenamiento local o en las cookies
            localStorage.setItem('token', response.token);
            // Redirigir a una página protegida
            this.router.navigate(['/menu']);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.errorMessage = 'Email o contraseña incorrectos';
          }
        });
    }
  }

  goToRegister() {
    console.log(this.router)
    this.router.navigate(['/login/register']);
  }
}
