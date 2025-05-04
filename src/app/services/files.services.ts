import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {  HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FilesService {
  API_URL = environment.API_URL;
  constructor(private http:HttpClient,private router: Router) {}
  addFiles(formData: FormData) {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      this.redirectToLogin();
      return throwError(() => new Error('No authentication token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Ne pas mettre 'Content-Type': 'application/json' quand on envoie FormData
      // Le navigateur va automatiquement définir le bon Content-Type avec le boundary
    });

    return this.http.post(`${this.API_URL}diagnostics`, formData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.redirectToLogin();
        }
        return throwError(() => error);
      })
    );
  }
  private redirectToLogin() {
    localStorage.setItem('redirect_url', this.router.url);
    this.router.navigate(['/auth']);
  }
  getFileByPatient() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      this.redirectToLogin();
      return throwError(() => new Error('Redirect to login page'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.API_URL}FilePatient`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.redirectToLogin();
        }
        return throwError(() => error);
      })
    );
  }  
  deleteFileById(fileId: any) {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.delete(`${this.API_URL}diagnostics/${fileId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur suppression:', error);
        return throwError(() => error);
      })
    );
  }
  getFileByDoctor() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      this.redirectToLogin();
      return throwError(() => new Error('Redirect to login page'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.API_URL}FileDoctor`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.redirectToLogin();
        }
        return throwError(() => error);
      })
    );
  }  
}