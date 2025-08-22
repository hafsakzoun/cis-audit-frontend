// src/app/services/auditor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {
  private baseUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Runs an audit and returns a Blob (zip file).
   */
  runAudit(formData: FormData): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/auditor`, formData, {
      responseType: 'blob',
      observe: 'events',
      reportProgress: true
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event.body as Blob;
        }
        return new Blob(); // fallback for progress events
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches persisted audit history from backend (Elasticsearch).
   */
  getAuditHistory(): Observable<any[]> {
    return this.http.get<{audits: any[]}>(`${this.baseUrl}/auditor/history`)
      .pipe(
        map(response => response.audits ?? []), // extract the "audits" array
        catchError(this.handleError)
      );
  }

  /**
   * Download audit result file by filename (from Flask endpoint).
   */
  downloadAudit(filename: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/auditor/download/${filename}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Audit API Error:', error);
    return throwError(() => new Error('Audit request failed. Check backend.'));
  }
}
