import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Make sure this is imported

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private router: Router) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  get f() {
    return this.registerForm.controls;
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

onSubmit(): void {
  this.submitted = true;

  // Stop if form is invalid
  if (this.registerForm.invalid) {
    return;
  }

  // Optional: Double-check password match if not handled by validator
  if (this.f.password.value !== this.f.confirmPassword.value) {
    alert("Passwords don't match");
    return;
  }

  const userData = {
    first_name: this.f.firstName.value,
    last_name: this.f.lastName.value,
    email: this.f.email.value,
    password: this.f.password.value
  };

  this.http.post('http://127.0.0.1:5000/auth/register', userData).subscribe({
    next: (response: any) => {
      alert('User registered successfully!');

      // ✅ Redirect to dashboard
      this.router.navigate(['/dashboard']);

      this.onReset(); // Reset form after navigation
    },
    error: (error) => {
      alert('Registration failed: ' + (error.error?.message || error.message || 'Unknown error'));
    }
  });
}

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
