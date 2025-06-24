import { Component, OnInit } from '@angular/core';
import { AuditorService } from '../services/audit/auditor.service';

interface AuditRecord {
  auditId: string;
  company: string;
  solution: string;
  auditor: string;
  date: Date;
  status: string;
  resultFile: string;      // URL object for the zip blob
  resultFileName: string;  // name for the zip file
}

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
  selectedFile: File | null = null;
  

  displayedColumns: string[] = ['auditId', 'company', 'solution', 'auditor', 'date', 'status', 'results'];

  auditHistory: AuditRecord[] = [];

  constructor(private auditorService: AuditorService) {}

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  
 submitAudit(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData();

  const formValues: any = {};
  const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
  inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    if (input instanceof HTMLInputElement && input.type === 'file') {
      if (this.selectedFile) {
        formData.append(input.name, this.selectedFile, this.selectedFile.name);
      }
    } else {
      formValues[input.name] = input.value;
      formData.append(input.name, input.value);
    }
  });

  this.auditorService.runAudit(formData).subscribe({
    next: (zipBlob: Blob) => {
      const zipUrl = URL.createObjectURL(zipBlob);
      const resultFileName = `audit_${Date.now()}.zip`;

      const newRecord: AuditRecord = {
        auditId: 'AUD-' + Math.floor(Math.random() * 10000),
        company: formValues['company'] || '',
        solution: formValues['solution'] || '',
        auditor: formValues['auditor'] || '',
        date: new Date(),
        status: 'Passed',
        resultFile: zipUrl,
        resultFileName: resultFileName
      };

      // Update auditHistory with new array reference to trigger change detection
      this.auditHistory = [newRecord, ...this.auditHistory];

      // Trigger download but don't revoke URL here
      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = resultFileName;
      anchor.click();
    },
    error: (err) => {
      console.error('Audit failed', err);
      alert('Erreur lors de l\'exécution de l\'audit.');

      const newRecord: AuditRecord = {
        auditId: 'AUD-' + Math.floor(Math.random() * 10000),
        company: formValues['company'] || '',
        solution: formValues['solution'] || '',
        auditor: formValues['auditor'] || '',
        date: new Date(),
        status: 'Failed',
        resultFile: '',
        resultFileName: ''
      };

      this.auditHistory = [newRecord, ...this.auditHistory];
    }
  });
}


  downloadDynamicFile(row: AuditRecord): void {
    if (!row.resultFile) {
      alert('No file available for download.');
      return;
    }
    const link = document.createElement('a');
    link.href = row.resultFile;
    link.download = row.resultFileName || 'audit_result.zip';
    link.click();
  }
}