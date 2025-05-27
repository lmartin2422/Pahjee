import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PictureService } from '../services/picture.service';



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
  uploading: boolean = false;
  error: string | null = null;

  constructor(private pictureService: PictureService) {}


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

  getImagePreview(file: File): string {
  return URL.createObjectURL(file);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.profilePicIndex === index) {
      this.profilePicIndex = null;
    } else if (this.profilePicIndex && this.profilePicIndex > index) {
      this.profilePicIndex--; // adjust index if needed
    }
  }

  uploadImages(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId || this.selectedFiles.length === 0) return;

    this.uploading = true;
    this.error = null;

    const uploads = this.selectedFiles.map((file, index) =>
      this.pictureService.uploadPicture(userId, file, index === this.profilePicIndex)
    );

    Promise.all(uploads.map(u => u.toPromise()))
      .then(() => {
        this.uploading = false;
        alert('Pictures uploaded successfully.');
        this.selectedFiles = [];
        this.profilePicIndex = null;
      })
      .catch(err => {
        this.uploading = false;
        this.error = 'Upload failed. Please try again.';
        console.error(err);
      });
  }
}
