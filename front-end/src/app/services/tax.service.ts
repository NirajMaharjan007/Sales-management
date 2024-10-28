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
  private edit: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.set = authService.baseUrl + '/set_tax';
    this.get = authService.baseUrl + '/get_taxes';
    this.edit = authService.baseUrl + '/edit_tax';
  }

  createTax(taxData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.set, taxData, { headers });
  }
}
