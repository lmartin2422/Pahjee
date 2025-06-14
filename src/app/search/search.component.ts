import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  users: any[] = [];

  filters = {
  gender: '',
  ageRange: '',
  lookingfor: '',
  location: ''
};

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    // Load all users initially (optional)
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.filter(user => user.id.toString() !== userId);
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

   performSearch(): void {
    const [min_age, max_age] = this.parseAgeRange(this.filters.ageRange);
    const payload = {
      gender: this.filters.gender,
      lookingfor: this.filters.lookingfor,
      location: this.filters.location,
      min_age,
      max_age
    };

    this.userService.searchUsers(payload).subscribe({
      next: (results: any[]) => {
        this.users = results;
      },
      error: (err) => {
        console.error('Search failed:', err);
      }
    });
  }

  parseAgeRange(range: string): [number?, number?] {
    switch (range) {
      case '18-24': return [18, 24];
      case '25-29': return [25, 29];
      case '30-39': return [30, 39];
      case '40+': return [40, 100];
      default: return [undefined, undefined];
    }
  }






}
