import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ Add this
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  user: any = null;

  constructor(
    private http: HttpClient,
    private router: Router // ✅ Inject Router
  ) {}

  
  ngOnInit(): void {
    console.log('✅ MyProfileComponent loaded!'); // <-- Add this line
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Load profile on init
    this.loadProfile();

    // ✅ Optionally reload if update flag is passed
    if (history.state.updated) {
      console.log('Detected updated flag in navigation state');
      this.loadProfile();
  }
}

  loadProfile(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
        this.user = data;
      });
    }
  }

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.put(`http://127.0.0.1:8000/users/${userId}`, this.user).subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err: any) => alert('Failed to update profile: ' + err.message),
      });
    }
  }
}






























// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { UserService } from '../services/user.service'; // Adjust the path as needed
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms'; // ✅ Add this
// import { Router } from '@angular/router'; // ✅ Add this



// @Component({
//   selector: 'app-my-profile',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './my-profile.component.html',
//   styleUrl: './my-profile.component.css'
// })


// export class MyProfileComponent implements OnInit {
//   user: any = null;

//   constructor(private http: HttpClient,
//     private router: Router) {}

//   ngOnInit(): void {
//     const userId = localStorage.getItem('user_id');
//     if (userId) {
//       this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
//         this.user = data;
//       });
//     }
//   }

//   onSubmit(): void {
//     const userId = localStorage.getItem('user_id');
//     if (userId) {
//       this.http.put(`http://127.0.0.1:8000/users/${userId}`, this.user).subscribe({
//         next: () => alert('Profile updated successfully!'),
//         error: (err: any) => alert('Failed to update profile: ' + err.message),
//       });
//     }
//   }
// }