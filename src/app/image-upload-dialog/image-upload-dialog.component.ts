import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
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
