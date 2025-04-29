import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service'; // Adjust the path as needed
@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})

export class MyProfileComponent implements OnInit {
  userData: any;

  constructor(private userService: UserService) {}

  // Example to get all ofthe users from the frontend
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.userData = data;
        console.log('User data loaded:', this.userData);
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      }
    });
  }
}