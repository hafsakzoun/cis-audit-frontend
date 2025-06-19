import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../services/generator/generator.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-script-generator',
  templateUrl: './script-generator.component.html',
  styleUrls: ['./script-generator.component.css']
})
export class ScriptGeneratorComponent implements OnInit {

  // Dropdown data
  categories: string[] = [];
  solutions: string[] = [];
  solutionVersions: string[] = [];
  benchmarkVersions: string[] = [];

  // Selected values
  selectedCategory: string = '';
  selectedSolution: string = '';
  selectedSolutionVersion: string = '';
  selectedBenchmarkVersion: string = '';
  editorName: string = 'Hafsa'; // You can update this to be dynamic if needed

  // Loading states
  isLoadingCategories = false;
  isLoadingSolutions = false;
  isLoadingSolutionVersions = false;
  isLoadingBenchmarkVersions = false;
  isGeneratingScript = false;
  generationResult: string = '';
  numberOfRules: number | null = null;

  constructor(
      private generatorService: GeneratorService,
      private http: HttpClient,
      private sanitizer: DomSanitizer
    ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.generatorService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => {
        console.error('Failed to load categories', err);
        this.categories = [];
      },
      complete: () => this.isLoadingCategories = false
    });
  }

  onCategoryChange(): void {
    this.resetSelections('category');

    if (this.selectedCategory) {
      this.isLoadingSolutions = true;
      this.generatorService.getSolutionsByCategory(this.selectedCategory).subscribe({
        next: (data) => this.solutions = data,
        error: (err) => {
          console.error('Failed to load solutions', err);
          this.solutions = [];
        },
        complete: () => this.isLoadingSolutions = false
      });
    }
  }

  onSolutionChange(): void {
    this.resetSelections('solution');

    if (this.selectedCategory && this.selectedSolution) {
      this.isLoadingSolutionVersions = true;
      this.isLoadingBenchmarkVersions = true;

      this.generatorService.getSolutionVersions(this.selectedCategory, this.selectedSolution).subscribe({
        next: (data) => this.solutionVersions = data,
        error: (err) => {
          console.error('Failed to load solution versions', err);
          this.solutionVersions = [];
        },
        complete: () => this.isLoadingSolutionVersions = false
      });

      this.generatorService.getBenchmarkVersions(this.selectedCategory, this.selectedSolution).subscribe({
        next: (data) => this.benchmarkVersions = data,
        error: (err) => {
          console.error('Failed to load benchmark versions', err);
          this.benchmarkVersions = [];
        },
        complete: () => this.isLoadingBenchmarkVersions = false
      });
    }
  }

  private resetSelections(level: 'category' | 'solution'): void {
    if (level === 'category') {
      this.selectedSolution = '';
      this.solutions = [];
    }

    this.selectedSolutionVersion = '';
    this.solutionVersions = [];

    this.selectedBenchmarkVersion = '';
    this.benchmarkVersions = [];
  }

  // ✅ Generate the script and print result
    generateAuditScript(): void {
    if (
      !this.selectedCategory ||
      !this.selectedSolution ||
      !this.selectedBenchmarkVersion ||
      !this.selectedSolutionVersion
    ) {
      return;
    }

    this.isGeneratingScript = true;
    this.generationResult = '';
    this.numberOfRules = null;

    const payload = {
      category: this.selectedCategory,
      solution: this.selectedSolution,
      benchmark_version: this.selectedBenchmarkVersion,
      solution_version: this.selectedSolutionVersion,
    };

    this.http.post<{ script: string }>(
      '/api/generate/script',
      payload
    ).subscribe({
      next: (response) => {
        const script = response.script || '';
        this.generationResult = script;
        // ✅ Count how many "# === Rule" patterns there are
        this.numberOfRules = (script.match(/# === Rule/g) || []).length;
      },
      error: (err) => {
        console.error('Script generation failed:', err);
        this.generationResult = '❌ Failed to generate script.';
      },
      complete: () => {
        this.isGeneratingScript = false;
      }
    });
  }

  downloadScript() {
    const blob = new Blob([this.generationResult], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_script.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  shareScriptViaEmail() {
    const subject = encodeURIComponent('CIS Audit Script');
    const body = encodeURIComponent(this.generationResult || '');
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }
}