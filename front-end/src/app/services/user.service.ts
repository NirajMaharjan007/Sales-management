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
  userDetailApi: string = '';
  httpClient = inject(HttpClient);

  private currentUser: any;

  constructor(
    private authService: AuthService,
    private localStorage: LocalStorageService
  ) {
    this.api = this.authService.baseUrl + '/user/';
    this.userDetailApi = this.authService.baseUrl + '/user_detail/';
  }
  ngOnInit(): void {}

  getUserById(id: string): Observable<any> {
    return this.httpClient.get(`${this.api}${id}/`);
  }

  getUserDetailsById(id: string): Observable<any> {
    return this.httpClient.get(`${this.userDetailApi}${id}/`);
  }

  getUserImageById(id: any): Observable<any> {
    return this.httpClient.get(`${this.userDetailApi}image/${id}/`, {
      responseType: 'blob',
    });
  }

  setUserDetails(id: string, data: any, image: File) {
    const formData = new FormData();
    formData.append('bio', data.bio);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('gender', data.gender);
    formData.append('date_of_birth', data.dob);
    formData.append('profile_picture', image, image.name);
    formData.append('user_id', id);

    for (const [key, value] of Object.entries(formData)) {
      console.log(key, value);
    }

    return this.httpClient.post(`${this.userDetailApi}`, formData);
  }
  updateUserDetails(id: string, data: any, image: File) {
    const formData = new FormData();
    formData.append('bio', data.bio);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('gender', data.gender);
    formData.append('date_of_birth', data.dob);
    formData.append('profile_picture', image, image.name);
    formData.append('user_id', id);

    for (const [key, value] of Object.entries(formData)) {
      console.log(key, value);
    }

    return this.httpClient.patch(`${this.userDetailApi}${id}/`, formData);
  }

  setUser(id: string, data: any) {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('first_name', data.firstName);
    formData.append('last_name', data.lastName);

    return this.httpClient.patch(`${this.api}${id}/`, formData);
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
