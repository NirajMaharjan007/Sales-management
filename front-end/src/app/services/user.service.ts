import { inject, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../auth/localstorage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  api: string = 'null';
  httpClient = inject(HttpClient);

  private currentUser: any;

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.api = this.authService.baseUrl + '/users/';
  }

  getUserById(id: string): Observable<any> {
    return this.httpClient.get(`${this.api}${id}`);
  }

  getUser() {
    if (this.authService.isLoggedIn()) {
      this.currentUser = JSON.parse(
        this.localStorage.getItem('auth_user') ?? '{}'
      );
    }

    return this.currentUser;
  }
}
