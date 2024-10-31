import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localstorage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:8080/api';

  constructor(private localStorageService: LocalStorageService) {}

  login(credentials: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/user/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      })
    );
  }

  logout(): boolean {
    try {
      this.httpClient
        .post(`${this.baseUrl}/user/logout`, {})
        .pipe(
          tap(() => {
            this.localStorageService.removeItem('auth_user');
            this.localStorageService.removeItem('authtoken_token');
            this.localStorageService.clear();

            sessionStorage.removeItem('token');
            sessionStorage.clear();
          })
        )
        .subscribe({
          next: () => {
            console.log('Logout successful');
          },
          error: (err) => {
            console.error('Logout failed:', err);
          },
        });

      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      return false;
    }
  }

  isLoggedIn() {
    return this.localStorageService.getItem('auth_user') !== null;
  }
}
