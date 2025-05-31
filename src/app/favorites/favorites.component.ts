import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!userId || !token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any[]>(`http://127.0.0.1:8000/users/${userId}/favorites`)
      .subscribe({
        next: data => {
          this.favorites = data;
        },
        error: err => {
          console.error('Error loading favorites:', err);
        }
      });
  }

  removeFavorite(favUserId: number): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    this.http.delete(`http://127.0.0.1:8000/users/${userId}/favorites/${favUserId}`)
      .subscribe({
        next: () => {
          // Refresh favorites after deletion
          this.ngOnInit();
        },
        error: err => {
          console.error('Error removing favorite:', err);
        }
      });
  }
}
