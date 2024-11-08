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

  createProduct(data: any, file: File) {
    const formData = new FormData();

    // Append each form field
    formData.append('name', data.name);
    formData.append('serial_number', data.serial_number);
    formData.append('model', data.model);
    formData.append('sales_price', data.sales_price.toString());
    formData.append('qty', data.qty.toString());
    formData.append('category_id', data.category_id.toString());
    formData.append('unit_id', data.unit_id.toString());
    formData.append('tax_id', data.tax_id.toString());

    formData.append('image', file, file.name);

    return this.http.post(this.api, formData);
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
