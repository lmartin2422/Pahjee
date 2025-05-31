import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';


import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


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
  locationSuggestions: string[] = [];
  locationFocused = false;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) 
    { this.profileForm = this.fb.group({
      firstname: [''],
      lastname: [''],
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
  const token = localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');

  // ✅ Redirect if user is not logged in
  if (!token || !userId) {
    this.router.navigate(['/login']);
    return;
  }

  // ✅ User is logged in, fetch profile
  this.http.get(`http://127.0.0.1:8000/users/${userId}`).subscribe((data: any) => {
    this.profileForm.patchValue(data);
  });
}

 
  onSubmit(): void {
  const userId = localStorage.getItem('user_id');

  if (userId && this.profileForm.valid) {
    const rawData = this.profileForm.value;

    // Remove fields with empty string values
    const cleanedData: any = {};
    for (const key in rawData) {
      if (rawData[key] !== '' && rawData[key] !== null) {
        cleanedData[key] = rawData[key];
      }
    }

    this.http.put(`http://127.0.0.1:8000/users/${userId}`, cleanedData).subscribe({
      next: () => {
        alert('Profile updated!');
        this.router.navigate(['/my-profile'], { state: { updated: true } });
      },
      error: (err) => {
        alert('Update failed: ' + err.message);
        console.error('Error details:', err);
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


onLocationInput() {
  const query = this.profileForm.get('location')?.value;
  if (query && query.length >= 2) {
    this.fetchLocationSuggestions(query);
  } else {
    this.locationSuggestions = [];
  }
}

fetchLocationSuggestions(query: string) {
  // Replace this with a real API call if needed
  const allLocations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
  this.locationSuggestions = allLocations.filter(loc =>
    loc.toLowerCase().includes(query.toLowerCase())
  );
}



selectLocation(location: string) {
  this.profileForm.get('location')?.setValue(location);
  this.locationSuggestions = [];
  this.locationFocused = false;
}



onLocationBlur() {
  setTimeout(() => {
    this.locationFocused = false;
  }, 200); // delay to allow click
}


savePictures() {
  const userId = localStorage.getItem('user_id');

  if (!userId || this.uploadedImages.length === 0) return;

  const formData = new FormData();
  this.uploadedImages.forEach(image => formData.append('pictures', image.file));
  formData.append('profile_picture', this.selectedProfilePic);

  this.http.post(`http://127.0.0.1:8000/users/${userId}/upload-pictures`, formData).subscribe({
    next: () => {
      // PATCH the form with the new profile picture
      this.profileForm.patchValue({ profile_picture: this.selectedProfilePic });
      alert('Pictures uploaded!');
      this.closeUploadModal();
    },
    error: (err) => alert('Upload failed: ' + err.message)
  });
}


}