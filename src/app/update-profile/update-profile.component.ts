import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';



@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UploadModalComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent implements OnInit {
  profileForm: FormGroup;

  genderOptions = ['Male', 'Female', 'Non-binary', 'Other'];
  orientationOptions = ['Straight', 'Gay', 'Bisexual', 'Asexual', 'Other'];
  lookingForOptions = ['Relationship', 'Dates', 'Hook Up', 'Friendship'];
  professionOptions = ['Tech', 'Healthcare', 'Education', 'Arts', 'Other'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      firstname: [''],
      lastname: [''],
      profile_picture: [''],
      location: [''],
      bio: [''],
      gender: [''],
      birthdate: [''],
      lookingfor: [''],
      sexualorientation: [''],
      professionindustry: ['']
    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
        this.profileForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    const userId = localStorage.getItem('userId');
    if (userId && this.profileForm.valid) {
      this.http.put(`http://127.0.0.1:8000/users/${userId}`, this.profileForm.value).subscribe({
        next: () => {
          alert('Profile updated!');
          this.router.navigate(['/my-profile']);
        },
        error: (err) => {
          alert('Update failed: ' + err.message);
        }
      });
    }
  }

showUploadModal = false;
uploadedImages: { file: File, url: string }[] = [];
selectedProfilePic: string = '';

openUploadModal() {
  this.showUploadModal = true;
}

closeUploadModal() {
  this.showUploadModal = false;
}

onFileSelected(event: any) {
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

removeImage(index: number) {
  this.uploadedImages.splice(index, 1);
}

selectProfilePicture(url: string) {
  this.selectedProfilePic = url;
}

savePictures() {
  const userId = localStorage.getItem('userId');

  if (!userId || this.uploadedImages.length === 0) return;

  const formData = new FormData();
  this.uploadedImages.forEach(image => formData.append('pictures', image.file));
  formData.append('profile_picture', this.selectedProfilePic);

  this.http.post(`http://127.0.0.1:8000/users/${userId}/upload-pictures`, formData).subscribe({
    next: () => {
      alert('Pictures uploaded!');
      this.closeUploadModal();
    },
    error: (err) => alert('Upload failed: ' + err.message)
  });
}


}