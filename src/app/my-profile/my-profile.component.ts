import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  user: any = null;
  pictures: any[] = [];
  backendUrl: string = 'http://127.0.0.1:8000'; // 👈 added

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('✅ MyProfileComponent loaded!');
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
    this.loadPictures();

    if (history.state.updated) {
      console.log('Detected updated flag in navigation state');
      this.loadProfile();
      this.loadPictures();
    }
  }

  loadProfile(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.get(`${this.backendUrl}/users/${userId}`).subscribe((data: any) => {
        this.user = data;

        // 🔽 Get profile picture
        this.http.get<any>(`${this.backendUrl}/profile-picture/${userId}`).subscribe({
          next: (pic) => {
            this.user.profile_picture = pic.image_url.startsWith('http')
              ? pic.image_url
              : `${this.backendUrl}${pic.image_url}`;
          },
          error: () => {
            console.log('No profile picture found');
          }
        });
      });
    }
  }





  loadPictures(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.get(`${this.backendUrl}/pictures/user/${userId}`).subscribe((data: any) => {
        // Add full URL to image path
      this.pictures = (data as any[]).map(pic => ({
        ...pic,
        image_url: pic.image_url.startsWith('http') ? pic.image_url : `${this.backendUrl}${pic.image_url}`
      }));

      });
    }
  }


  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.http.put(`${this.backendUrl}/users/${userId}`, this.user).subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err: any) => alert('Failed to update profile: ' + err.message),
      });
    }
  }
}
