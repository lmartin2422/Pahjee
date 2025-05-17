import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service'; // Adjust the path as needed
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Add this


@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})


export class MyProfileComponent implements OnInit {
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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