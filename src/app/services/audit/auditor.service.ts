// src/app/services/auditor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditorService {
  private apiUrl = 'http://127.0.0.1:5000/api/auditor';

  constructor(private http: HttpClient) {}

  runAudit(formData: FormData): Observable<Blob> {
    return this.http.post(this.apiUrl, formData, {
      responseType: 'blob',              // On attend un fichier ZIP
      observe: 'events',                 // Pour suivre la progression
      reportProgress: true
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event.body as Blob;
        }
        return new Blob(); // fallback
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Audit API Error:', error);
    return throwError(() => new Error('Échec de l’audit. Veuillez vérifier le backend.'));
  }
}
