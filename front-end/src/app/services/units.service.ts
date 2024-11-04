import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  api: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = this.authService.baseUrl + '/unit/';
  }

  createUnit(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, data, { headers });
  }

  getUnits(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.api, { headers });
  }

  getById(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.api}${id}/`, { headers });
  }

  editUnit(id: any, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.api}${id}/`, data, {
      headers,
    });
  }

  deleteUnit(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.api}${id}/`, { headers });
  }
}
