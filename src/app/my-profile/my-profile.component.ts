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

        // 🔁 Fetch profile picture separately and merge it into the user object
        this.http.get(`${this.backendUrl}/profile-picture/${userId}`).subscribe({
          next: (picData: any) => {
            this.user.profile_picture = picData.image_url.startsWith('http')
              ? picData.image_url
              : `${this.backendUrl}${picData.image_url}`;
          },
          error: err => {
            console.warn("No profile picture found:", err.message);
            this.user.profile_picture = null;
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


  uploadProfilePicture(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  const userId = localStorage.getItem('user_id');
  formData.append('user_id', userId!);

  this.http.post(`${this.backendUrl}/profile-picture/upload?user_id=${userId}`, formData).subscribe({
    next: (res: any) => {
      this.user.profile_picture = res.image_url;
    },
    error: err => {
      alert('Upload failed: ' + err.message);
    }
  });
}

handleFileSelection(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;

  // Generate preview
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.previewUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

confirmUpload(): void {
  if (!this.selectedFile) return;

  const formData = new FormData();
  const userId = localStorage.getItem('user_id');
  formData.append('file', this.selectedFile);
  formData.append('user_id', userId!);

  this.http.post(`${this.backendUrl}/profile-picture/upload?user_id=${userId}`, formData).subscribe({
    next: (res: any) => {
      this.user.profile_picture = res.image_url;
      this.previewUrl = null;
      this.selectedFile = null;
    },
    error: err => {
      alert('Upload failed: ' + err.message);
    }
  });
}

cancelUpload(): void {
  this.selectedFile = null;
  this.previewUrl = null;
}


deleteProfilePicture(): void {
  const userId = localStorage.getItem('user_id');
  this.http.delete(`${this.backendUrl}/profile-picture/${userId}`).subscribe({
    next: () => {
      this.user.profile_picture = null;
      alert('Profile picture deleted!');
    },
    error: err => alert('Delete failed: ' + err.message)
  });
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
