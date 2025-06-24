import { Component, OnInit } from '@angular/core';
import { AuditorService } from '../services/audit/auditor.service';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
  selectedFile: File | null = null;

  displayedColumns: string[] = ['auditId', 'company', 'solution', 'date', 'version', 'status', 'auditor', 'results'];

  auditHistory = [
    {
      auditId: 'AUD1234',
      company: 'Acme Corp',
      solution: 'Firewall Suite',
      version: 'v2.1',
      auditor: 'John Doe',
      date: new Date('2025-06-15T10:00:00'),
      status: 'Passed',
      resultFile: 'acme_audit_result.xlsx'
    }
  ];

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

    // Gather all inputs from the form
    const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
    inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      if (input instanceof HTMLInputElement && input.type === 'file') {
        if (this.selectedFile) {
          formData.append(input.name, this.selectedFile, this.selectedFile.name);
        }
      } else {
        formData.append(input.name, input.value);
      }
    });

    this.auditorService.runAudit(formData).subscribe({
      next: (zipBlob: Blob) => {
        const url = window.URL.createObjectURL(zipBlob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'audit_result.zip';
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up
      },
      error: (err) => {
        console.error('Audit failed', err);
        alert('Erreur lors de l\'exécution de l\'audit. Vérifiez la console.');
      }
    });
  }

  downloadFile(file: string): void {
    const fileUrl = `/assets/audit-results/${file}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file;
    link.click();
  }
}
