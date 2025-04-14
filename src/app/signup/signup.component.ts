import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors  } from '@angular/forms';
import { UserService } from '../../services/user.service';  // Update path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      retypePassword: ['', Validators.required],
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
    },
    { validators: this.passwordsMatchValidator }
  );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('retypePassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
  
    // Check password mismatch
    if (this.signupForm.errors?.['passwordMismatch']) {      alert('Passwords do not match!');
      return;
    }
      this.userService.registerUser(this.signupForm.value).subscribe({
        next: (res) => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Registration failed: ' + err.error.detail);
        }
      });
    }
  }

