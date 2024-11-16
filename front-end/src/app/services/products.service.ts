import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = this.authService.baseUrl + '/product';
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

    return this.http.post(`${this.api}/`, formData);
  }
  updatedProduct(id: any, data: any, file: File) {
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

    return this.http.patch(`${this.api}/${id}/`, formData);
  }

  getProductImage(id: any): Observable<any> {
    return this.http.get(`${this.api}/image/${id}/`, {
      responseType: 'blob',
    });
  }
  getProductById(id: any): Observable<any> {
    return this.http.get(`${this.api}/${id}/`);
  }
  getProductBySerial(serial: string): Observable<any> {
    return this.http
      .get<boolean>(`${this.api}/serial/${serial}/`)
      .pipe(catchError(() => of(false)));
  }

  createProductSupplier(data: any) {
    return this.http.post(
      `${this.authService.baseUrl}/product_supplier/`,
      data
    );
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.authService.baseUrl}/product/`);
  }

  getProductAllImage(): Observable<any> {
    return this.http.get(`${this.api}/image/`, {
      responseType: 'blob',
    });
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
