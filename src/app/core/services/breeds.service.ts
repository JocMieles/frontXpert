import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BreedsService {

  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu API
  constructor(private http: HttpClient) { }

  breeds(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/breeds`);
  }

  imagesBreed(breed: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/imagesbybreedid/${breed}`);
  }
}
