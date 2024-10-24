import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8080/api';
  constructor() {}

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((result) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('authUser', JSON.stringify(result));
        } else if (typeof sessionStorage !== 'undefined') {
          // Fallback to sessionStorage if localStorage is not supported
          sessionStorage.setItem('authUser', JSON.stringify(result));
        } else {
          // If neither localStorage nor sessionStorage is supported
          console.error('Web Storage is not supported in this environment.');
        }
      })
    );
  }

  logout() {
    try {
      localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Error in logout:', error);
    }
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }
}
