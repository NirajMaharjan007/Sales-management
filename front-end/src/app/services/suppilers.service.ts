import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuppilersService {
  api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = authService.baseUrl + '/suppiler/';
  }

  createSupplier(supplierData: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, supplierData, { headers });
  }

  getSuppliers() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.api, { headers });
  }

  getSupplierById(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.api}${id}/`, { headers });
  }

  deleteSupplier(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.api}${id}/`, { headers });
  }

  editSupplier(id: any, supplierData: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.api}${id}/`, supplierData, { headers });
  }
}
