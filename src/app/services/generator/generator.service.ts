import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  // ✅ Use relative path — proxy will forward to Flask backend
  private readonly BASE_URL = '/api/cis-controls';

  constructor(private http: HttpClient) {}

  // ✅ 1. Get all categories
  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/categories`);
  }

  // ✅ 2. Get solutions by selected category
  getSolutionsByCategory(category: string): Observable<string[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<string[]>(`${this.BASE_URL}/solutions`, { params });
  }

  // ✅ 3. Get solution versions by selected category and solution
  getSolutionVersions(category: string, solution: string): Observable<string[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('solution', solution);
    return this.http.get<string[]>(`${this.BASE_URL}/solution-versions`, { params });
  }

  // ✅ 4. Get benchmark versions by selected category and solution
  getBenchmarkVersions(category: string, solution: string): Observable<string[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('solution', solution);
    return this.http.get<string[]>(`${this.BASE_URL}/benchmark-versions`, { params });
  }

  // ✅ 5. Generate script from user selection
  generateScript(payload: {
    category: string;
    version: string;
    benchmark_version: string;
    editor_name: string;
  }): Observable<any> {
    return this.http.post('/api/generate/script', payload);
  }
}
