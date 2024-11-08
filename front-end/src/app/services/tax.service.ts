import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = authService.baseUrl + '/tax/';
  }

  createTax(taxData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, taxData, { headers });
  }
  getTaxes(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.api, { headers });
  }

  deleteTax(taxData: any): Observable<any> {
    var del = this.api + taxData;
    return this.http.delete(del, taxData);
  }
}
