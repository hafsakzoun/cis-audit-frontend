import { Component, OnInit } from '@angular/core';
import { AuditorService } from '../services/audit/auditor.service';

interface AuditRecord {
  audit_id: number;       // integer
  company: string;
  solution: string;
  auditor: string;
  date: Date;
  status: string;
  results?: string;       // report file path
  script_file?: string;   // script file path
}

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
  selectedFile: File | null = null;
displayedColumns: string[] = ['audit_id', 'company', 'solution', 'auditor', 'date', 'status', 'results', 'script'];
  auditHistory: AuditRecord[] = [];

  constructor(private auditorService: AuditorService) {}

  ngOnInit(): void {
    this.loadAuditHistory();
  }

  loadAuditHistory(): void {
    this.auditorService.getAuditHistory().subscribe({
      next: (records) => {
        // backend returns { audits: [...] }, already handled in service
        this.auditHistory = records.map(r => ({
          audit_id: r.audit_id,
          company: r.company,
          solution: r.solution,
          auditor: r.auditor,
          date: new Date(r.date),
          status: r.status,
          results: r.results,        // report file path
          script_file: r.script_file // script file path
        }));
      },
      error: (err) => console.error('Failed to fetch audit history:', err)
    });
  }

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
        if (zipBlob.size > 0) {
          const resultFileName = `audit_${Date.now()}.zip`;
          const anchor = document.createElement('a');
          anchor.href = URL.createObjectURL(zipBlob);
          anchor.download = resultFileName;
          anchor.click();

          // Refresh audit history after a new audit
          this.loadAuditHistory();
        }
      },
      error: (err) => {
        console.error('Audit failed', err);
        this.loadAuditHistory(); // still refresh to show failed attempts
      }
    });
  }

downloadFile(filePath: string): void {
  if (!filePath) return;
  const filename = filePath.split('/').pop();
  if (!filename) return;
  this.auditorService.downloadAudit(filename).subscribe({
    next: (blob: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
    error: () => alert('Failed to download file.')
  });
}

}
