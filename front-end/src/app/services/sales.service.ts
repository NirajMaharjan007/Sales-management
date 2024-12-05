import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  api = '';
  constructor(private authService: AuthService, private http: HttpClient) {
    this.api = this.authService.baseUrl + '/sales/';
  }
  getSales(): Observable<any> {
    return this.http.get<any>(this.api);
  }

  getSalesByProductId(index: number): Observable<any> {
    return this.http.get<any>(`${this.api}product_id/${index}`);
  }
  getSalesByDate(date: any): Observable<any> {
    return this.http.get<any>(`${this.api}created_at/${date}/`);
  }

  getSalesById(id: any): Observable<any> {
    return this.http.get<any>(`${this.api}${id}/`);
  }
}
