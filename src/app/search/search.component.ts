import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  showFilters = false;

  users: any[] = [];
  backendUrl = 'http://127.0.0.1:8000';

  ageOptions = ['18-24', '25-29', '30-39', '40+'];

  filters = {
    gender: [] as string[],
    ageRanges: [] as string[], // ✅ changed from ageRange string
    lookingfor: [] as string[],
    location: [] as string[],
    sexualorientation: [] as string[],
    professionindustry: [] as string[]
  };


  usernameQuery = '';

  genderOptions = ['male', 'female', 'other'];
  orientationOptions = ['straight', 'gay', 'bisexual', 'other'];
  lookingForOptions = ['friends', 'dating', 'relationship', 'networking', 'other'];
  professionOptions = ['student', 'engineer', 'artist', 'other'];
  locationOptions = ['coming soon']; // You can expand this

  constructor(private router: Router, private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        const filtered = data.filter(user => user.id.toString() !== userId);
        this.loadProfilePictures(filtered);
      },
      error: err => console.error('Failed to load users:', err)
    });
  }

  onCheckboxChange(field: keyof typeof this.filters, event: any): void {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      (this.filters[field] as string[]).push(value);
    } else {
      const index = (this.filters[field] as string[]).indexOf(value);
      if (index !== -1) {
        (this.filters[field] as string[]).splice(index, 1);
      }
    }
  }

   performSearch(): void {
  let minAge: number | null = 100;
  let maxAge: number | null = 0;

  this.filters.ageRanges.forEach(range => {
    const [min, max] = this.parseAgeRange(range);
      if (min !== undefined && (minAge === null || min < minAge)) {
        minAge = min;
      }

      if (max !== undefined && (maxAge === null || max > maxAge)) {
        maxAge = max;
      }
   });

  if (minAge === 100) minAge = null;
  if (maxAge === 0) maxAge = null;

  const payload: any = {
    gender: this.filters.gender,
    lookingfor: this.filters.lookingfor,
    location: this.filters.location,
    sexualorientation: this.filters.sexualorientation,
    professionindustry: this.filters.professionindustry,
    min_age: minAge,
    max_age: maxAge
  };

  this.userService.searchUsers(payload).subscribe({
    next: (results: any[]) => {
      this.loadProfilePictures(results);
    },
    error: (err) => console.error('Search failed:', err)
  });
}


  loadProfilePictures(users: any[]): void {
    const updatedUsers = [...users];
    updatedUsers.forEach((user, index) => {
      this.http.get<any>(`${this.backendUrl}/profile-picture/${user.id}`).subscribe({
        next: pic => {
          updatedUsers[index].profile_picture = pic.image_url.startsWith('http')
            ? pic.image_url
            : `${this.backendUrl}${pic.image_url}`;
        },
        error: () => {
          updatedUsers[index].profile_picture = 'assets/default-avatar.png';
        }
      });
    });

    this.users = updatedUsers;
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


  viewProfile(userId: string): void {
    this.router.navigate(['/view-profile', userId]);
  }

  resetFilters(): void {
  this.filters = {
    gender: [],
    ageRanges: [],
    lookingfor: [],
    location: [],
    sexualorientation: [],
    professionindustry: []
  };

  this.usernameQuery = '';
  const currentUserId = localStorage.getItem('user_id');

  this.userService.getAllUsers().subscribe({
    next: (data: any[]) => {
      const filteredUsers = data.filter(user => user.id.toString() !== currentUserId);
      this.loadProfilePictures(filteredUsers);
    },
    error: err => console.error('Failed to reload users on reset:', err)
  });
}

}