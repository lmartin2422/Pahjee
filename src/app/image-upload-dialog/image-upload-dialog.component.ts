import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';  // Import MatDialogModule


@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule],  // Add MatDialogModule here
})
export class ImageUploadDialogComponent {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<ImageUploadDialogComponent>) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (this.selectedFile) {
      // Implement image upload logic here (e.g., upload to server)
      this.dialogRef.close(this.selectedFile);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
