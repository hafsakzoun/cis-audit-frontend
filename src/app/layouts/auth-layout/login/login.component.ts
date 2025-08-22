import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Shortcut to access form fields in HTML
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.loading = true;

    this.http.post('http://127.0.0.1:5000/auth/login', loginData).subscribe({
      next: (response: any) => {
        alert(response.message || 'Login successful');

        // Store token if available
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Reset form and redirect
        this.loginForm.reset();
        this.submitted = false;
        this.loading = false;

        this.router.navigate(['/dashboard']); // Adjust route as needed
      },
      error: (error) => {
        alert(error.error?.error || 'Login failed. Please try again.');
        this.loading = false;
      }
    });
  }
}
