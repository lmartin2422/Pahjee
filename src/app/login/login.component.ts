import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // ✅ Add CommonModule here
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userService: UserService // ✅ inject service
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

//   onSubmit(): void {
//   if (this.loginForm.valid) {
//     this.http.post('http://127.0.0.1:8000/login', this.loginForm.value).subscribe({
//       next: (res: any) => {
//         alert('Login successful!');
//         console.log('Login response:', res);
//         console.log('Token:', res.access_token);  // Confirm key name

//         // ✅ Store the token and user ID
//         localStorage.setItem('access_token', res.access_token);  // <- THIS WAS MISSING
//         localStorage.setItem('user_id', res.user_id);
//         this.userService.setUsername(res.username);

//         this.router.navigate(['/my-profile']).then(success => {
//           console.log('Navigated to /my-profile:', success);
//         });
//       },
//       error: (err) => {
//         console.error(err);
//         this.loginError = err.error?.detail || 'Login failed. Please try again.';
//       }
//     });
//   } else {
//     this.loginForm.markAllAsTouched();
//   }
// }


onSubmit(): void {
  if (this.loginForm.valid) {
    this.http.post('http://127.0.0.1:8000/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        alert('Login successful!');
        console.log('Login response:', res);
        console.log('Token:', res.access_token);  // Confirm key name

        // ✅ Store the token and user ID
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('user_id', res.user_id);
        }
        this.userService.setUsername(res.username);

        this.router.navigate(['/my-profile']).then(success => {
          console.log('Navigated to /my-profile:', success);
        });
      },
      error: (err) => {
        console.error(err);
        this.loginError = err.error?.detail || 'Login failed. Please try again.';
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}


  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
