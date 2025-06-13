import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ExtractedEntry {
  fileName: string;
  extractedAt: Date;
  csv: string;
  saved: boolean;
  downloadLink: string;
}

@Component({
  selector: 'app-rules-extractor',
  templateUrl: './rules-extractor.component.html',
  styleUrls: ['./rules-extractor.component.css']
})
export class RulesExtractorComponent {
  selectedFile: File | null = null;
  downloadLink: string | null = null;
  csvReady: boolean = false;

  saveStatus: 'success' | 'error' | null = null;
  saveMessage: string = '';

  extractedCSVData: string = ''; // to store CSV as text for DB saving

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.downloadLink = null;
    this.csvReady = false;
    this.saveStatus = null;
    this.saveMessage = '';
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', this.selectedFile);

    this.http.post('http://localhost:3000/extract', formData, { responseType: 'text' }) // CSV as text
      .subscribe(csv => {
        this.extractedCSVData = csv;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        this.downloadLink = url;
        this.csvReady = true;
      }, error => {
        console.error('File upload failed:', error);
      });
  }

  saveToDatabase(): void {
    if (!this.csvReady || !this.extractedCSVData) return;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { csv: this.extractedCSVData };

    this.http.post('http://localhost:3000/save-to-es', body, { headers })
      .subscribe(() => {
        this.saveStatus = 'success';
        this.saveMessage = 'Data successfully saved to Elasticsearch!';
      }, error => {
        this.saveStatus = 'error';
        this.saveMessage = 'Failed to save data to Elasticsearch.';
        console.error('Save failed:', error);
      });
  }

  extractedEntries: ExtractedEntry[] = [];

}
