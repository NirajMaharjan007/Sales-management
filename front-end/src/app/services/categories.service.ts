import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private api: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.api = authService.baseUrl + '/category/';
  }

  createCategory(categoryData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, categoryData, { headers });
  }

  getCategories(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.api, { headers });
  }
  getCategoryById(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(this.api + id, { headers });
  }

  editCategory(id: any, categoryData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(this.api + id, categoryData, {
      headers,
    });
  }

  deleteCategory(categoryData: any) {
    var del = this.api + categoryData;
    return this.http.delete(del, categoryData);
  }
}
