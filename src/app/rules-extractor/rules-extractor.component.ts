import { Component } from '@angular/core';
import { ExtractorService } from '../services/extractor/extractor.service';

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
  csvReady = false;

  saveStatus: 'success' | 'error' | null = null;
  saveMessage = '';
  extractedCSVData = '';
  extractedEntries: ExtractedEntry[] = [];

  constructor(private extractorService: ExtractorService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;

    if (file) {
      console.log('✅ File selected:', file.name);
    } else {
      console.log('🚫 File selection cleared');
    }

    this.resetExtractionState();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Please select a PDF file first.');
      return;
    }

    console.log('⬆ Uploading:', this.selectedFile.name);

    this.extractorService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) {
          alert('No CSV data received.');
          return;
        }

        console.log('📦 Blob received');

        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        const extractedFileName = match?.[1] || this.getOutputFileName();

        const reader = new FileReader();
        reader.onload = () => {
          const csvText = reader.result as string;
          this.extractedCSVData = csvText;
          this.csvReady = true;

          const url = window.URL.createObjectURL(blob);
          this.downloadLink = url;

          const entry: ExtractedEntry = {
            fileName: extractedFileName,
            extractedAt: new Date(),
            csv: csvText,
            saved: false,
            downloadLink: url
          };

          this.extractedEntries.unshift(entry);
          console.log('✅ CSV extracted and ready:', extractedFileName);
        };

        reader.onerror = (error) => {
          console.error('❌ Error reading Blob as text:', error);
          alert('Failed to read extracted CSV data.');
        };

        reader.readAsText(blob);
      },
      error: (err) => {
        console.error('❌ Upload failed:', err);
        alert('Extraction failed. Please try again.');
      }
    });
  }

  getOutputFileName(): string {
    if (!this.selectedFile) return 'output.csv';
    const original = this.selectedFile.name.replace(/\.pdf$/i, '');
    return `${original}_output.csv`;
  }

  downloadCSV(csvData: string, filename: string): void {
    try {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.setAttribute('download', filename);
      anchor.style.display = 'none';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);

      console.log('⬇ Download triggered for:', filename);
    } catch (err) {
      console.error('❌ Error triggering CSV download:', err);
    }
  }

  saveToDatabase(): void {
    if (!this.csvReady || !this.extractedCSVData) {
      console.warn('🚫 Save attempted without ready CSV');
      return;
    }

    console.log('💾 Saving to Elasticsearch...');
    this.extractorService.saveCSVToElasticsearch(this.extractedCSVData).subscribe({
      next: () => {
        this.saveStatus = 'success';
        this.saveMessage = 'Data successfully saved to Elasticsearch!';
        console.log('✅ Save successful');

        if (this.extractedEntries.length > 0) {
          this.extractedEntries[0].saved = true;
        }
      },
      error: (error) => {
        this.saveStatus = 'error';
        this.saveMessage = 'Failed to save data to Elasticsearch.';
        console.error('❌ Save failed:', error);
      }
    });
  }

  private resetExtractionState(): void {
    this.downloadLink = null;
    this.csvReady = false;
    this.saveStatus = null;
    this.saveMessage = '';
    this.extractedCSVData = '';
  }

  saveSingleToDatabase(entry: ExtractedEntry): void {
  console.log(`💾 Saving entry "${entry.fileName}" to Elasticsearch...`);
  this.extractorService.saveCSVToElasticsearch(entry.csv).subscribe({
    next: () => {
      entry.saved = true;
      this.saveStatus = 'success';
      this.saveMessage = `Entry "${entry.fileName}" saved to Elasticsearch.`;
      console.log('✅ Entry saved');
    },
    error: (error) => {
      this.saveStatus = 'error';
      this.saveMessage = `Failed to save entry "${entry.fileName}".`;
      console.error('❌ Save failed:', error);
    }
  });
}

  
}