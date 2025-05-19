import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-modal.component.html',
  styleUrl: './upload-modal.component.css',
})
export class UploadModalComponent {
  selectedFiles: File[] = [];
  profilePicIndex: number | null = null;

  getImagePreview(file: File): string {
  return URL.createObjectURL(file);
}


  constructor(private http: HttpClient) {}

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];

    if (files.length + this.selectedFiles.length > 6) {
      alert('You can upload a maximum of 6 pictures.');
      return;
    }

    this.selectedFiles.push(...files);
  }

  setProfilePicture(index: number): void {
    this.profilePicIndex = index;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.profilePicIndex === index) {
      this.profilePicIndex = null;
    }
  }

  uploadImages(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      formData.append('files', file);
      if (index === this.profilePicIndex) {
        formData.append('profile_picture', file.name);
      }
    });

    this.http.post(`http://127.0.0.1:8000/users/${userId}/upload_pictures`, formData).subscribe({
      next: () => alert('Upload successful!'),
      error: (err) => alert('Upload failed: ' + err.message)
    });
  }
}
