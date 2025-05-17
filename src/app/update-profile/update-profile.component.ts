import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
}