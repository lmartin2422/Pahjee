import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  users: any[] = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    // ✅ Load users for explore (optional: add filtering later)
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.filter(user => user.id.toString() !== userId); // exclude current user
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      }
    });
  }
}
