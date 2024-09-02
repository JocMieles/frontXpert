import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{token: string, user: any}> {
    return this.http.post<any>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          if(response && response.token && response.user) {
            const token = response.token;
            this.setToken(token.toString());
            this.setUser(response.user)
          }
        },
        error => console.log(error)
      )
      );
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  logout() {
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); 
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, {...user});
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    console.log(token);
    localStorage.setItem('token', token);
    console.log(localStorage)
  }
}
