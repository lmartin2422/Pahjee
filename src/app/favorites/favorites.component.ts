import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Required for *ngIf, *ngFor
import { RouterModule, Router } from '@angular/router'; // ✅ For router navigation
import { HttpClientModule, HttpClient } from '@angular/common/http'; // ✅ For HTTP requests

@Component({
  selector: 'app-favorites',
  standalone: true, // ✅ Standalone component
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  backendUrl = 'http://127.0.0.1:8000'; // ✅ Match your backend

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!userId || !token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any[]>(`${this.backendUrl}/users/${userId}/favorites`)
      .subscribe({
        next: data => {
          this.favorites = data;
        },
        error: err => {
          console.error('Error loading favorites:', err);
        }
      });
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/view-profile', userId]);
  }

  removeFavorite(favUserId: number): void {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    this.http.delete(`${this.backendUrl}/users/${userId}/favorites/${favUserId}`)
      .subscribe({
        next: () => this.ngOnInit(), // Refresh list
        error: err => {
          console.error('Error removing favorite:', err);
        }
      });
  }
}
