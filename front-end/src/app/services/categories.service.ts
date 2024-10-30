import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private set: string;
  private get: string;
  private edit: string;
  private delete: string;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.set = authService.baseUrl + '/set_category';
    this.get = authService.baseUrl + '/get_categories';
    this.edit = authService.baseUrl + '/edit_category/';
    this.delete = authService.baseUrl + '/delete_category/';
  }

  createCategory(categoryData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.set, categoryData, { headers });
  }

  getCategories(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.get, { headers });
  }
}
