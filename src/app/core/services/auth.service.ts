import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);  // Almacena el token
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');  // Remueve el token del almacenamiento local
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Verifica si hay un token
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, {...user});
  }

  getToken(): string | null {
    return localStorage.getItem('token');  // Recupera el token del almacenamiento local
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);  // Almacena el token en el almacenamiento local
  }
}
