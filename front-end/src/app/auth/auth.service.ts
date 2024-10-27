import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8080/api';
  constructor(private localStorageService: LocalStorageService) {}

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((result) => {
        this.localStorageService.setItem('auth_user', JSON.stringify(result));
      })
    );
  }

  logout() {
    try {
      this.localStorageService.removeItem('auth_user');
    } catch (error) {
      console.error('Error in logout:', error);
    }
  }

  isLoggedIn() {
    return this.localStorageService.getItem('auth_user') !== null;
  }
}
