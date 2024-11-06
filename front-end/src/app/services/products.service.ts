import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = this.authService.baseUrl + '/product/';
  }

  createProduct(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.info(data);
    return this.http.post(this.api, data, { headers });
  }

  createProductSupplier(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.authService.baseUrl}/product_supplier/`,
      data,
      { headers }
    );
  }
}
