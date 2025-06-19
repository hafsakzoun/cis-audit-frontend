// extractor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtractorService {
  private extractUrl = 'http://127.0.0.1:5000/api/extract';
  private saveUrl = 'http://127.0.0.1:5000/api/save-to-es';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<HttpResponse<Blob>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.extractUrl, formData, {
      observe: 'response',  // ⬅️ get full response (with headers)
      responseType: 'blob'
    });
  }

  saveCSVToElasticsearch(csv: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.saveUrl, { csv }, { headers });
  }
}
