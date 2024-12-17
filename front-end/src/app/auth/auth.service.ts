import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localstorage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:8080/api';

  constructor(
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient
  ) {}

  login(credentials: any): Observable<any> {
    return this.httpClient
      .post(`${this.baseUrl}/user/login/`, credentials)
      .pipe(
        tap((response: any) => {
          this.localStorageService.setItem('authtoken_token', response.token);
          // this.localStorageService.setItem('authtoken_token');
          this.localStorageService.setItem(
            'auth_user',
            JSON.stringify(response.user)
          );
        })
      );
  }

  logout(): boolean {
    try {
      const key = this.localStorageService.getItem('authtoken_token');
      this.httpClient.delete(`${this.baseUrl}/token/${key}/`).subscribe(() => {
        this.httpClient
          .post(`${this.baseUrl}/user/logout/`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
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
              console.log('Logout successful ');
            },
            error: (err) => {
              console.error('Logout failed:', err);
            },
          });
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
