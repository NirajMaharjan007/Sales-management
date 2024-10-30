import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private set: string;
  private get: string;
  private delete: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.set = authService.baseUrl + '/set_tax';
    this.get = authService.baseUrl + '/get_taxes';
    this.delete = authService.baseUrl + '/delete_tax/';
  }

  createTax(taxData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.set, taxData, { headers });
  }
  getTaxes(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.get, { headers });
  }

  deleteTax(taxData: any): Observable<any> {
    var del = this.delete + taxData;
    return this.http.delete(del, taxData);
  }
}
