import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.http.post('http://127.0.0.1:8000/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        alert('Login successful!');
        console.log(res);
        localStorage.setItem('userId', res.user_id); // ✅ Store ID
        this.router.navigate(['/my-profile']);        // ✅ Redirect
      },
      error: () => {
        alert('Login failed');
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
