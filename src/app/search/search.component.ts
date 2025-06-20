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
  location: '',
  sexualorientation: '',
  professionindustry: ''
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
    const [minAge, maxAge] = this.parseAgeRange(this.filters.ageRange);

    const payload: any = {
      gender: this.filters.gender || null,
      lookingfor: this.filters.lookingfor || null,
      location: this.filters.location || null,
      sexualorientation: this.filters.sexualorientation,
      professionindustry: this.filters.professionindustry,
      min_age: minAge ?? null,
      max_age: maxAge ?? null
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

  usernameQuery: string = '';

  searchByUsername(): void {
    if (!this.usernameQuery.trim()) return;
    this.userService.searchByUsername(this.usernameQuery.trim()).subscribe({
      next: (res: any) => {
        this.users = res ? [res] : [];
      },
      error: err => console.error('Username search failed:', err)
    });
  }


  backendUrl = 'http://127.0.0.1:8000'; // Add this if not already present

  viewProfile(userId: string): void {
    this.router.navigate(['/view-profile', userId]);
  }


  resetFilters(): void {
  this.filters = {
    gender: '',
    ageRange: '',
    lookingfor: '',
    location: '',
    sexualorientation: '',
    professionindustry: ''
  };
  this.usernameQuery = '';
  this.users = [];
}








}
