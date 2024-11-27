import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private api: string = '';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.api = this.authService.baseUrl + '/invoices/';
  }

  createSales(data: any) {
    const salesApi = this.authService.baseUrl + '/sales/';
    return this.http.post(salesApi, data);
  }

  createInvoice(data: any) {
    return this.http.post(this.api, data);
  }

  deleteInvoice(id: any) {
    return this.http.delete(`${this.api}${id}/`);
  }

  getInvoiceByCustomerId(customerId: string) {
    const salesApi = this.authService.baseUrl + '/sales/';
    this.http.get(`${salesApi}${customerId}`);
  }

  getInvoices() {
    return this.http.get(this.api);
  }

  getInvoiceById(id: number) {
    return this.http.get(`${this.api}${id}/`);
  }
}
