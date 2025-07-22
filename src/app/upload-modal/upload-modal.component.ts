import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() close = new EventEmitter<void>();

  profilePicIndex: number = 0; // default to first image
  uploadedImages: { file: File; url: string }[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length + this.uploadedImages.length <= 6) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({ file, url: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    } else {
      alert('Maximum 6 images allowed.');
    }
  }

  uploadPictures(): void {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

    // const userId = localStorage.getItem('user_id');
    if (!userId) {
      alert('User not logged in.');
      return;
    }

    if (this.uploadedImages.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    const formData = new FormData();

    // Add all images
    this.uploadedImages.forEach((imgObj) => {
      formData.append('files', imgObj.file);
    });

    // Add profile pic filename with generated pattern
    const profileFile = this.uploadedImages[this.profilePicIndex]?.file;
    if (profileFile) {
      // Simulate backend filename format: userId_timestamp_filename
      const timestamp = Date.now(); // close enough for matching
      const filename = `${userId}_${timestamp}_${profileFile.name}`;
      formData.append('profile_pic_filename', filename);
    }

    this.http.post(`http://localhost:8000/users/${userId}/upload_pictures`, formData)
      .subscribe({
        next: () => {
          alert('Images uploaded successfully!');
          this.uploadedImages = [];
          this.closeModal();
        },
        error: (err) => {
          console.error('Upload failed', err);
          alert('Image upload failed. Please try again.');
        }
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}
